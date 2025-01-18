import { supabase } from '../supabase';
import { AppError, DatabaseError } from '../../utils/error';
import { logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';

interface RequestConfig {
  retries?: number;
  cache?: boolean;
  timeout?: number;
}

export class BaseApi {
  protected supabase = supabase;
  private cache = new Cache<any>({ ttl: 5 * 60 * 1000 }); // 5 minutes cache

  protected async handleRequest<T>(
    key: string,
    request: () => Promise<{ data: T | null; error: any }>,
    config: RequestConfig = {}
  ): Promise<T> {
    const { retries = 3, cache = true, timeout = 10000 } = config;

    // Check cache first
    if (cache) {
      const cachedData = this.cache.get(key);
      if (cachedData) {
        logger.debug('Cache hit:', key);
        return cachedData;
      }
    }

    let attempt = 0;
    while (attempt < retries) {
      try {
        // Add timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        const result = await Promise.race([request(), timeoutPromise]);

        if (result.error) {
          throw this.handleError(result.error);
        }

        if (!result.data) {
          throw new AppError('No data returned from request');
        }

        // Cache successful response
        if (cache) {
          this.cache.set(key, result.data);
        }

        return result.data as T;
      } catch (error) {
        logger.error(`Request failed (attempt ${attempt + 1}/${retries}):`, error);
        
        if (attempt === retries - 1) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        
        attempt++;
      }
    }

    throw new AppError('Max retries exceeded');
  }

  protected handleError(error: any): Error {
    logger.error('API Error:', error);

    if (error?.code === 'PGRST301') {
      return new DatabaseError('Database connection error');
    }

    if (error?.code === '23505') {
      return new DatabaseError('Duplicate entry');
    }

    if (error?.code === '23503') {
      return new DatabaseError('Referenced record not found');
    }

    return new AppError(
      error?.message || 'An unexpected error occurred',
      error?.code
    );
  }

  protected generateCacheKey(prefix: string, params: object): string {
    return `${prefix}:${JSON.stringify(params)}`;
  }
}