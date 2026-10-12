/** Deterministic hashing and seeded randomness, so generated content is stable for a given key. */

/** 32-bit FNV-1a hash of a string. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG: returns a function yielding floats in [0, 1). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pick() from empty list');
  return items[Math.floor(rand() * items.length)] as T;
}

/** Picks `count` distinct items (or all items if fewer). */
export function pickMany<T>(rand: () => number, items: readonly T[], count: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  while (pool.length > 0 && out.length < count) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0] as T);
  }
  return out;
}

export function randomInt(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

export function createId(prefix = 'id'): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rnd}`;
}
