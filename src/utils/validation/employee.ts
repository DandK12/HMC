import { ValidationError } from '../error';
import { isUUID } from '../uuid';
import type { Employee } from '../../types';

const VALID_POSITIONS = [
  'Komisaris Utama',
  'Sumber Daya Manusia',
  'Bendahara',
  'Pemasaran',
  'Sekretaris',
  'Staff Ahli',
  'Eksekutif',
  'Karyawan',
  'Training',
  'Resigned',
] as const;

export function validateEmployeeId(id: unknown): asserts id is string {
  if (!id || typeof id !== 'string' || !isUUID(id)) {
    throw new ValidationError('Invalid employee ID');
  }
}

export function validateEmployeeData(data: Partial<Employee>): void {
  // Name validation
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }
    if (data.name.length > 100) {
      throw new ValidationError('Name must not exceed 100 characters');
    }
  }

  // Position validation
  if (data.position !== undefined) {
    if (!VALID_POSITIONS.includes(data.position as any)) {
      throw new ValidationError('Invalid position');
    }
  }

  // Join date validation
  if (data.joinDate !== undefined) {
    const date = new Date(data.joinDate);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid join date');
    }
    
    // Cannot be in the future
    if (date > new Date()) {
      throw new ValidationError('Join date cannot be in the future');
    }
  }
}