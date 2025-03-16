import { Component } from '@angular/core';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-task-details',
  imports: [],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  task: Task = {
    id: 1,
    name: 'Redberry-ს საიტის ლენდინგის დიზაინი ',
    description:
      'შექმენი საიტის მთავარი გვერდი, რომელიც მოიცავს მთავარ სექციებს, ნავიგაციას.                        ',
    due_date: new Date('2023-09-09'),
    status: { id: 1, name: 'test', icon: 'test' },
    priority: {
      id: 2,
      name: 'საშუალო',
      icon: 'https://www.pacific-research.com/wp-content/uploads/2020/05/medium-icon.png',
    },
    department: { id: 1, name: 'დიზაინი' },
    employee: {
      id: 1,
      name: 'test',
      surname: 'test',
      avatar: '',
      department_id: 1,
    },
  };
}
