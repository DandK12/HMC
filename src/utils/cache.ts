interface CacheOptions {
  ttl: number; // Time to live in milliseconds
}

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly defaultTTL: number;

  constructor(options: CacheOptions) {
    this.defaultTTL = options.ttl;
  }

  set(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Create cache instances
export const employeeCache = new Cache<any>({ ttl: 5 * 60 * 1000 }); // 5 minutes
export const leaveRequestCache = new Cache<any>({ ttl: 2 * 60 * 1000 }); // 2 minutes