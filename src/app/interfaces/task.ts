import { Department } from './department';
import { Employee } from './employee';
import { Priority } from './priority';
import { Status } from './status';

export interface Task {
  id?: number;
  name?: string;
  description?: string;
  due_date?: string;
  status?: Status;
  priority?: Priority;
  department?: Department;
  employee?: Employee;
}
