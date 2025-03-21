import { Department } from './department';

export interface Employee {
  id?: number;
  name?: string;
  surname?: string;
  avatar?: string;
  department: Department;
}
