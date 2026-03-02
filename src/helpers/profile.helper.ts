type ProfileEntry = {
  totalMs: number;
  count: number;
};

function nowMs() {
  return Number(process.hrtime.bigint()) / 1_000_000;
}

export class Profiler {
  private readonly entries = new Map<string, ProfileEntry>();

  constructor(public readonly enabled: boolean) {}

  add(label: string, elapsedMs: number) {
    if (!this.enabled) {
      return;
    }

    const prev = this.entries.get(label);
    if (prev) {
      prev.totalMs += elapsedMs;
      prev.count += 1;
      return;
    }

    this.entries.set(label, { totalMs: elapsedMs, count: 1 });
  }

  runSync<T>(label: string, fn: () => T): T {
    if (!this.enabled) {
      return fn();
    }

    const startMs = nowMs();
    try {
      return fn();
    } finally {
      this.add(label, nowMs() - startMs);
    }
  }

  async runAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (!this.enabled) {
      return await fn();
    }

    const startMs = nowMs();
    try {
      return await fn();
    } finally {
      this.add(label, nowMs() - startMs);
    }
  }

  formatLines() {
    if (!this.enabled) {
      return [] as string[];
    }

    return Array.from(this.entries.entries())
      .sort((a, b) => b[1].totalMs - a[1].totalMs)
      .map(([label, entry]) => {
        const avgMs = entry.totalMs / entry.count;
        return `${label}: ${entry.totalMs.toFixed(1)}ms (count: ${entry.count}, avg: ${avgMs.toFixed(2)}ms)`;
      });
  }
}
