import { useMemo, useCallback } from 'react';
import type { Employee, WorkingHours } from '../../types';

export function useEmployeeStats(employee: Employee | null) {
  return useMemo(() => {
    if (!employee) return null;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .slice(0, 7);

    const monthlyHours = (month: string) =>
      employee.workingHours
        .filter(hours => hours.date.startsWith(month))
        .reduce((total, hours) => total + hours.totalHours, 0);

    const currentMonthHours = monthlyHours(currentMonth);
    const previousMonthHours = monthlyHours(previousMonth);
    const percentageChange = previousMonthHours
      ? ((currentMonthHours - previousMonthHours) / previousMonthHours) * 100
      : 0;

    return {
      currentMonthHours,
      previousMonthHours,
      percentageChange,
      totalHours: employee.workingHours.reduce((sum, wh) => sum + wh.totalHours, 0),
    };
  }, [employee]);
}

export function useFilteredWorkingHours(
  workingHours: WorkingHours[],
  searchQuery: string,
  selectedMonth: string
) {
  return useMemo(() => {
    return workingHours
      .filter(hours => hours.date.startsWith(selectedMonth))
      .filter(hours => {
        const searchLower = searchQuery.toLowerCase();
        return hours.date.toLowerCase().includes(searchLower);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workingHours, searchQuery, selectedMonth]);
}

export function useSortedEmployees(employees: Employee[], searchQuery: string) {
  return useMemo(() => {
    const filtered = employees.filter(employee => {
      const searchLower = searchQuery.toLowerCase();
      return (
        employee.name.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower)
      );
    });

    return [...filtered].sort((a, b) => {
      // First sort by position
      const positionCompare = a.position.localeCompare(b.position);
      if (positionCompare !== 0) return positionCompare;
      
      // Then by name
      return a.name.localeCompare(b.name);
    });
  }, [employees, searchQuery]);
}