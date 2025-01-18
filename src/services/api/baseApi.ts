import { supabase } from '../../lib/supabase';
import { DatabaseError } from '../../utils/error';

export class BaseApi {
  protected async handleError(error: any, message: string): never {
    console.error(`${message}:`, error);
    if (error?.code === 'PGRST301') {
      throw new DatabaseError('Database connection error. Please try again.');
    }
    throw new DatabaseError(message, error);
  }

  protected supabase = supabase;
}