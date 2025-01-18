interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async isRateLimited(key: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests
    let requests = this.requests.get(key) || [];
    
    // Remove expired timestamps
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (requests.length >= this.config.maxRequests) {
      return true;
    }
    
    // Add new request timestamp
    requests.push(now);
    this.requests.set(key, requests);
    
    return false;
  }

  clearExpired(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(ts => ts > windowStart);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }
}

// Create rate limiters for different endpoints
export const rateLimiters = {
  api: new RateLimiter({ windowMs: 60000, maxRequests: 100 }), // 100 requests per minute
  auth: new RateLimiter({ windowMs: 300000, maxRequests: 5 }), // 5 login attempts per 5 minutes
  export: new RateLimiter({ windowMs: 60000, maxRequests: 10 }), // 10 exports per minute
};

// Start cleanup interval
setInterval(() => {
  Object.values(rateLimiters).forEach(limiter => limiter.clearExpired());
}, 60000); // Clean up every minute