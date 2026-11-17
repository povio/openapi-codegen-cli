use std::sync::{Arc, Condvar, Mutex};
use std::thread::JoinHandle;

const MAX_RENDER_THREADS: usize = 8;
static RENDER_POOL: PoolManager = PoolManager::new();
/// Threads freeing a finished compile's intermediate data. Teardown joins them so no
/// thread runs addon code (destructors included) once Node may unload the addon.
static RELEASES: Mutex<Vec<JoinHandle<()>>> = Mutex::new(Vec::new());

struct RenderWorkers {
    pool: Option<rayon::ThreadPool>,
    threads: Vec<JoinHandle<()>>,
}

impl RenderWorkers {
    fn new() -> Result<Self, String> {
        let count = std::thread::available_parallelism()
            .map(usize::from)
            .unwrap_or(1)
            .min(MAX_RENDER_THREADS);
        let mut threads = Vec::with_capacity(count);
        let result = rayon::ThreadPoolBuilder::new()
            .num_threads(count)
            .thread_name(|index| format!("openapi-render-{index}"))
            .spawn_handler(|thread| {
                let mut builder = std::thread::Builder::new();
                if let Some(name) = thread.name() {
                    builder = builder.name(name.to_string());
                }
                if let Some(size) = thread.stack_size() {
                    builder = builder.stack_size(size);
                }
                threads.push(builder.spawn(|| thread.run())?);
                Ok(())
            })
            .build();
        match result {
            Ok(pool) => Ok(Self {
                pool: Some(pool),
                threads,
            }),
            Err(error) => {
                // Rayon signals already-created workers to stop when construction fails.
                // Join them before returning, just as on normal addon teardown.
                for thread in threads {
                    let _ = thread.join();
                }
                Err(format!(
                    "Could not initialize native render workers: {error}"
                ))
            }
        }
    }

    fn pool(&self) -> &rayon::ThreadPool {
        self.pool.as_ref().unwrap()
    }
}

impl Drop for RenderWorkers {
    fn drop(&mut self) {
        // Rayon Drop only signals termination. Explicit joins also finish worker TLS
        // destructors before Node can unload the addon containing their code.
        drop(self.pool.take());
        for thread in self.threads.drain(..) {
            let _ = thread.join();
        }
    }
}

struct PoolState {
    environments: usize,
    calls: usize,
    changing: bool,
    workers: Option<Arc<RenderWorkers>>,
}

struct PoolManager {
    state: Mutex<PoolState>,
    changed: Condvar,
}

impl PoolManager {
    const fn new() -> Self {
        Self {
            state: Mutex::new(PoolState {
                environments: 0,
                calls: 0,
                changing: false,
                workers: None,
            }),
            changed: Condvar::new(),
        }
    }

    fn register_environment(&self) {
        self.state.lock().unwrap().environments += 1;
        self.changed.notify_all();
    }

    fn release_environment(&self) {
        let mut state = self.state.lock().unwrap();
        state.environments -= 1;
        // NAPI calls are synchronous, but also account for direct native callers.
        while state.environments == 0 && (state.changing || state.calls > 0) {
            state = self.changed.wait(state).unwrap();
        }
        let workers = Self::take_idle_workers(&mut state);
        let last_environment = state.environments == 0;
        drop(state);
        if last_environment {
            join_releases();
        }
        self.finish_shutdown(workers);
    }

    fn acquire(&self) -> Result<RenderLease<'_>, String> {
        let mut state = self.state.lock().unwrap();
        while state.changing {
            state = self.changed.wait(state).unwrap();
        }
        let workers = if let Some(workers) = &state.workers {
            Arc::clone(workers)
        } else {
            state.changing = true;
            drop(state);
            // Neither worker initialization nor partial-construction cleanup holds
            // the manager lock. Other callers wait for this single initialization.
            let result = RenderWorkers::new();
            state = self.state.lock().unwrap();
            state.changing = false;
            self.changed.notify_all();
            let workers = Arc::new(result?);
            state.workers = Some(Arc::clone(&workers));
            workers
        };
        state.calls += 1;
        Ok(RenderLease {
            manager: self,
            workers: Some(workers),
        })
    }

    fn release_call(&self) {
        let mut state = self.state.lock().unwrap();
        state.calls -= 1;
        let workers = Self::take_idle_workers(&mut state);
        self.changed.notify_all();
        drop(state);
        self.finish_shutdown(workers);
    }

    fn take_idle_workers(state: &mut PoolState) -> Option<Arc<RenderWorkers>> {
        if state.environments == 0 && state.calls == 0 && !state.changing {
            let workers = state.workers.take();
            state.changing = workers.is_some();
            workers
        } else {
            None
        }
    }

    fn finish_shutdown(&self, workers: Option<Arc<RenderWorkers>>) {
        if let Some(workers) = workers {
            // All call leases are gone; dropping this owner joins every worker.
            drop(workers);
            self.state.lock().unwrap().changing = false;
            self.changed.notify_all();
        }
    }
}

struct RenderLease<'a> {
    manager: &'a PoolManager,
    workers: Option<Arc<RenderWorkers>>,
}

impl Drop for RenderLease<'_> {
    fn drop(&mut self) {
        // Release the call's Arc before the manager's last owner can be dropped.
        drop(self.workers.take());
        self.manager.release_call();
    }
}

pub(crate) fn register_environment(env: napi::Env) -> napi::Result<()> {
    RENDER_POOL.register_environment();
    if let Err(error) = env.add_env_cleanup_hook((), |_| RENDER_POOL.release_environment()) {
        RENDER_POOL.release_environment();
        return Err(error);
    }
    Ok(())
}

/// Drops `value` on a tracked thread so the caller can return without paying for
/// freeing large trees. Falls back to dropping inline if no thread can be spawned.
pub(crate) fn release_in_background<T: Send + 'static>(value: T) {
    let mut releases = RELEASES.lock().unwrap();
    let mut index = 0;
    while index < releases.len() {
        if releases[index].is_finished() {
            let _ = releases.swap_remove(index).join();
        } else {
            index += 1;
        }
    }
    // A failed spawn drops the closure, and with it `value`, on this thread.
    if let Ok(handle) = std::thread::Builder::new()
        .name("openapi-codegen-release".into())
        .spawn(move || drop(value))
    {
        releases.push(handle);
    }
}

fn join_releases() {
    let releases = std::mem::take(&mut *RELEASES.lock().unwrap());
    for handle in releases {
        let _ = handle.join();
    }
}

/// Nested joins and parallel iterators share these bounded workers. Only Rust data
/// enters the pool; N-API values are created after this synchronous call returns.
pub(crate) fn install<R: Send>(render: impl FnOnce() -> R + Send) -> Result<R, String> {
    let lease = RENDER_POOL.acquire()?;
    Ok(lease.workers.as_ref().unwrap().pool().install(render))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;
    use std::sync::atomic::{AtomicUsize, Ordering};

    struct ExitMarker(Arc<AtomicUsize>);
    impl Drop for ExitMarker {
        fn drop(&mut self) {
            self.0.fetch_add(1, Ordering::SeqCst);
        }
    }
    thread_local! {
        static EXIT_MARKER: RefCell<Option<ExitMarker>> = const { RefCell::new(None) };
    }

    #[test]
    fn last_environment_waits_for_worker_tls_cleanup_and_pool_can_restart() {
        let manager = PoolManager::new();
        manager.register_environment();
        manager.register_environment();
        let lease = manager.acquire().unwrap();
        let pool = lease.workers.as_ref().unwrap().pool();
        let count = pool.current_num_threads();
        assert!((1..=MAX_RENDER_THREADS).contains(&count));
        let exited = Arc::new(AtomicUsize::new(0));
        pool.broadcast(|_| {
            EXIT_MARKER.with(|marker| {
                *marker.borrow_mut() = Some(ExitMarker(Arc::clone(&exited)));
            })
        });
        drop(lease);
        assert_eq!(exited.load(Ordering::SeqCst), 0);
        manager.release_environment();
        assert_eq!(exited.load(Ordering::SeqCst), 0);
        manager.release_environment();
        assert_eq!(exited.load(Ordering::SeqCst), count);
        assert!(manager.state.lock().unwrap().workers.is_none());
        let restarted = manager.acquire().unwrap();
        assert_eq!(
            restarted.workers.as_ref().unwrap().pool().install(|| 42),
            42
        );
        drop(restarted);
        assert!(manager.state.lock().unwrap().workers.is_none());
    }

    #[test]
    fn concurrent_calls_reuse_one_pool_and_nested_work_stays_in_it() {
        let manager = PoolManager::new();
        manager.register_environment();
        let barrier = std::sync::Barrier::new(4);
        let identities = std::thread::scope(|scope| {
            (0..4)
                .map(|_| {
                    scope.spawn(|| {
                        let lease = manager.acquire().unwrap();
                        let workers = lease.workers.as_ref().unwrap();
                        let identity = Arc::as_ptr(workers) as usize;
                        barrier.wait();
                        let result = workers.pool().install(|| {
                            rayon::join(
                                || {
                                    let nested = manager.acquire().unwrap();
                                    let nested_pool = nested.workers.as_ref().unwrap().pool();
                                    assert!(nested_pool.current_thread_index().is_some());
                                    nested_pool.install(|| 17)
                                },
                                || {
                                    assert!(workers.pool().current_thread_index().is_some());
                                    29
                                },
                            )
                        });
                        assert_eq!(result, (17, 29));
                        identity
                    })
                })
                .collect::<Vec<_>>()
                .into_iter()
                .map(|handle| handle.join().unwrap())
                .collect::<Vec<_>>()
        });
        assert!(identities.iter().all(|identity| *identity == identities[0]));
        manager.release_environment();
    }
}
