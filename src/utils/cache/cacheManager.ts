import { Cache } from './cache';

// Cache instances with different TTLs
const shortCache = new Cache<any>({ ttl: 1 * 60 * 1000 }); // 1 minute
const mediumCache = new Cache<any>({ ttl: 5 * 60 * 1000 }); // 5 minutes
const longCache = new Cache<any>({ ttl: 30 * 60 * 1000 }); // 30 minutes

export const cacheManager = {
  // Employee data cache (5 minutes)
  employees: mediumCache,
  
  // Leave requests cache (1 minute)
  leaveRequests: shortCache,
  
  // Working hours cache (5 minutes)
  workingHours: mediumCache,
  
  // Resignation requests cache (1 minute)
  resignationRequests: shortCache,
  
  // Wage calculations cache (30 minutes)
  wageCalculations: longCache,
  
  // Clear all caches
  clearAll() {
    shortCache.clear();
    mediumCache.clear();
    longCache.clear();
  },
  
  // Clear specific cache by key pattern
  clearByPattern(pattern: string) {
    [shortCache, mediumCache, longCache].forEach(cache => {
      cache.clearByPattern(pattern);
    });
  }
};