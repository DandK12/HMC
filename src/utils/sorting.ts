import type { Employee } from '../types';

const POSITION_ORDER = [
  'Komisaris Utama',
  'Sekretaris',
  'Sumber Daya Manusia',
  'Pemasaran',
  'Bendahara',
  'Staff Ahli',
  'Eksekutif',
  'Karyawan',
  'Training',
  'Resigned',
] as const;

export function sortEmployees(employees: Employee[]): Employee[] {
  return [...employees].sort((a, b) => {
    // First sort by position order
    const positionA = POSITION_ORDER.indexOf(a.position as typeof POSITION_ORDER[number]);
    const positionB = POSITION_ORDER.indexOf(b.position as typeof POSITION_ORDER[number]);
    
    if (positionA !== positionB) {
      return positionA - positionB;
    }
    
    // Then sort alphabetically by name within the same position
    return a.name.localeCompare(b.name);
  });
}