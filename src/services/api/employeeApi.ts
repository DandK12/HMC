import { BaseApi } from './baseApi';
import type { Employee } from '../../types';

export class EmployeeApi extends BaseApi {
  async getAll(): Promise<Employee[]> {
    try {
      const { data, error } = await this.supabase
        .from('employees')
        .select(`
          *,
          working_hours (
            id,
            date,
            check_in,
            check_out,
            total_hours
          )
        `)
        .order('name');

      if (error) {
        return this.handleError(error, 'Failed to fetch employees');
      }

      return this.transformEmployeeData(data || []);
    } catch (error) {
      return this.handleError(error, 'Error in getAll employees');
    }
  }

  async create(employee: Omit<Employee, 'id' | 'warnings' | 'workingHours'>): Promise<Employee> {
    try {
      const { data, error } = await this.supabase
        .from('employees')
        .insert({
          name: employee.name,
          position: employee.position,
          join_date: employee.joinDate,
          status: 'active',
        })
        .select(`
          *,
          working_hours (
            id,
            date,
            check_in,
            check_out,
            total_hours
          )
        `)
        .single();

      if (error) {
        return this.handleError(error, 'Failed to create employee');
      }

      return this.transformEmployeeData([data])[0];
    } catch (error) {
      return this.handleError(error, 'Error in create employee');
    }
  }

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const { data, error } = await this.supabase
        .from('employees')
        .update({
          name: updates.name,
          position: updates.position,
          join_date: updates.joinDate,
          status: updates.position === 'Resigned' ? 'resigned' : 'active',
        })
        .eq('id', id)
        .select(`
          *,
          working_hours (
            id,
            date,
            check_in,
            check_out,
            total_hours
          )
        `)
        .single();

      if (error) {
        return this.handleError(error, 'Failed to update employee');
      }

      return this.transformEmployeeData([data])[0];
    } catch (error) {
      return this.handleError(error, 'Error in update employee');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        return this.handleError(error, 'Failed to delete employee');
      }
    } catch (error) {
      return this.handleError(error, 'Error in delete employee');
    }
  }

  private transformEmployeeData(data: any[]): Employee[] {
    return data.map(item => ({
      id: item.id,
      name: item.name,
      position: item.position,
      joinDate: item.join_date,
      warnings: [],
      workingHours: (item.working_hours || []).map((wh: any) => ({
        id: wh.id,
        date: wh.date,
        checkIn: wh.check_in,
        checkOut: wh.check_out,
        totalHours: wh.total_hours || 0,
      })),
    }));
  }
}