import { Department } from './department';
import { Employee } from './employee';
import { Priority } from './priority';

export interface Tag {
  group: string;
  item: Department | Priority | Employee;
}
