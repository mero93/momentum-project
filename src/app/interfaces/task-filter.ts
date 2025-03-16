import { Department } from './department';
import { Employee } from './employee';
import { Priority } from './priority';

export interface TaskFilter {
  departments: Department[];
  priorities: Priority[];
  employee?: Employee;
}
