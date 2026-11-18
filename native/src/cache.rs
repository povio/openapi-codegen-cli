//! Bounded successful results shared by active addon environments. No disk cache.
use crate::json::Value;
use napi::{Env, Result};
use std::collections::VecDeque;
use std::sync::{Arc, Mutex};

const MAX_ENTRIES: usize = 2;
const MAX_BYTES: usize = 32 * 1024 * 1024;
static CACHE: Mutex<Cache> = Mutex::new(Cache::new());

struct Entry {
    source: String,
    yaml: bool,
    options: String,
    data: Arc<Value>,
    bytes: usize,
}
impl Entry {
    fn matches(&self, source: &str, yaml: bool, options: &str) -> bool {
        self.yaml == yaml && self.source == source && self.options == options
    }
}
struct Cache {
    environments: usize,
    epoch: u64,
    entries: VecDeque<Entry>,
}
impl Cache {
    const fn new() -> Self {
        Self {
            environments: 0,
            epoch: 0,
            entries: VecDeque::new(),
        }
    }
    fn release(&mut self) {
        self.environments -= 1;
        if self.environments == 0 {
            self.entries.clear();
            self.epoch = self.epoch.wrapping_add(1);
        }
    }
    fn lookup(
        &mut self,
        source: &str,
        yaml: bool,
        options: &str,
    ) -> (Option<u64>, Option<Arc<Value>>) {
        if self.environments == 0 {
            return (None, None);
        }
        let found = self
            .entries
            .iter()
            .position(|entry| entry.matches(source, yaml, options));
        let data = found.map(|index| {
            let entry = self.entries.remove(index).unwrap();
            let data = Arc::clone(&entry.data);
            self.entries.push_back(entry);
            data
        });
        (Some(self.epoch), data)
    }
    fn insert(&mut self, epoch: u64, entry: Entry, limit: usize) {
        // A call that began before the last environment closed must not repopulate
        // either a closed cache or a newly opened generation of it.
        if self.environments == 0 || self.epoch != epoch || entry.bytes > limit {
            return;
        }
        self.entries
            .retain(|old| !old.matches(&entry.source, entry.yaml, &entry.options));
        while self.entries.len() >= MAX_ENTRIES
            || self
                .entries
                .iter()
                .map(|entry| entry.bytes)
                .sum::<usize>()
                .saturating_add(entry.bytes)
                > limit
        {
            self.entries.pop_front();
        }
        self.entries.push_back(entry);
    }
}

// Include JSON node and map overhead as well as string storage. This is an
// estimated retained-memory budget, not a bound on allocator/process RSS.
fn weight(value: &Value) -> usize {
    std::mem::size_of::<Value>().saturating_add(match value {
        Value::String(s) => s.capacity(),
        Value::Array(values) => values
            .iter()
            .fold(0usize, |n, v| n.saturating_add(weight(v))),
        Value::Object(values) => values.iter().fold(0usize, |n, (k, v)| {
            n.saturating_add(k.capacity())
                .saturating_add(96)
                .saturating_add(weight(v))
        }),
        _ => 0,
    })
}

pub fn register_environment(env: Env) -> Result<()> {
    CACHE.lock().unwrap().environments += 1;
    if let Err(error) = env.add_env_cleanup_hook((), |_| CACHE.lock().unwrap().release()) {
        CACHE.lock().unwrap().release();
        return Err(error);
    }
    Ok(())
}
pub fn lookup(source: &str, yaml: bool, options: &str) -> (Option<u64>, Option<Arc<Value>>) {
    CACHE.lock().unwrap().lookup(source, yaml, options)
}
pub fn insert(epoch: Option<u64>, source: String, yaml: bool, options: String, data: &Value) {
    let Some(epoch) = epoch else {
        return;
    };
    let bytes = source
        .capacity()
        .saturating_add(options.capacity())
        .saturating_add(weight(data));
    if bytes > MAX_BYTES {
        return;
    }
    // Compilation and deep copies run outside the lock. Simultaneous misses may
    // compile independently; insertion leaves just one entry for an identical key.
    let entry = Entry {
        source,
        yaml,
        options,
        data: Arc::new(data.clone()),
        bytes,
    };
    CACHE.lock().unwrap().insert(epoch, entry, MAX_BYTES);
}

#[cfg(test)]
mod tests {
    use super::*;
    fn entry(source: &str, bytes: usize) -> Entry {
        Entry {
            source: source.into(),
            yaml: false,
            options: "{}".into(),
            data: Arc::new(crate::json!({"nested":[1]})),
            bytes,
        }
    }
    #[test]
    fn exact_keys_fresh_values_and_lru_entry_limit() {
        let mut cache = Cache::new();
        assert_eq!(cache.lookup("a", false, "{}").0, None);
        cache.environments = 1;
        cache.insert(0, entry("a", 10), 100);
        assert!(cache.lookup("a", true, "{}").1.is_none());
        assert!(cache.lookup("a", false, "{ }").1.is_none());
        assert!(cache.lookup("b", false, "{}").1.is_none());
        let mut copy = (*cache.lookup("a", false, "{}").1.unwrap()).clone();
        copy["nested"][0] = Value::Null;
        assert_eq!(cache.lookup("a", false, "{}").1.unwrap()["nested"][0], 1);
        cache.insert(0, entry("b", 10), 100);
        cache.lookup("a", false, "{}");
        cache.insert(0, entry("c", 10), 100);
        assert!(cache.lookup("b", false, "{}").1.is_none());
        assert_eq!(cache.entries.len(), 2);
        cache.insert(0, entry("a", 10), 100);
        assert_eq!(cache.entries.len(), 2);
    }
    #[test]
    fn byte_limit_evicts_and_oversized_entries_do_not_displace_results() {
        let mut cache = Cache::new();
        cache.environments = 1;
        cache.insert(0, entry("a", 10), 20);
        cache.insert(0, entry("b", 10), 20);
        cache.insert(0, entry("huge", 21), 20);
        assert_eq!(cache.entries.len(), 2);
        cache.insert(0, entry("c", 15), 20);
        assert_eq!(cache.entries.len(), 1);
        assert!(cache.lookup("c", false, "{}").1.is_some());
    }
    #[test]
    fn final_environment_cleanup_clears_and_rejects_old_inflight_insertions() {
        let mut cache = Cache::new();
        cache.environments = 2;
        cache.insert(0, entry("a", 1), 20);
        let weak = Arc::downgrade(&cache.entries[0].data);
        cache.release();
        assert!(cache.lookup("a", false, "{}").1.is_some());
        cache.release();
        assert!(weak.upgrade().is_none());
        cache.insert(0, entry("closed", 1), 20);
        assert!(cache.entries.is_empty());
        cache.environments = 1;
        cache.insert(0, entry("stale", 1), 20);
        assert!(cache.entries.is_empty());
        cache.insert(1, entry("fresh", 1), 20);
        assert!(cache.lookup("fresh", false, "{}").1.is_some());
    }
    #[test]
    fn concurrent_identical_misses_keep_one_entry() {
        let cache = Arc::new(Mutex::new(Cache::new()));
        cache.lock().unwrap().environments = 1;
        let gate = Arc::new(std::sync::Barrier::new(4));
        std::thread::scope(|scope| {
            for _ in 0..4 {
                let cache = Arc::clone(&cache);
                let gate = Arc::clone(&gate);
                scope.spawn(move || {
                    let (epoch, data) = cache.lock().unwrap().lookup("a", false, "{}");
                    assert!(data.is_none());
                    gate.wait();
                    cache
                        .lock()
                        .unwrap()
                        .insert(epoch.unwrap(), entry("a", 10), 20);
                });
            }
        });
        let mut cache = cache.lock().unwrap();
        assert_eq!(cache.entries.len(), 1);
        assert_eq!(cache.lookup("a", false, "{}").1.unwrap()["nested"][0], 1);
    }
}
