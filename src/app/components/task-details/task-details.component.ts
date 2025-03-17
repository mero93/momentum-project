import { Component } from '@angular/core';
import { Task } from '../../interfaces/task';
import { CommonModule, DatePipe } from '@angular/common';
import { Department } from '../../interfaces/department';
import { Status } from '../../interfaces/status';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  task: Task = {
    id: 1,
    name: 'Redberry-ს საიტის ლენდინგის დიზაინი ',
    description:
      'შექმენი საიტის მთავარი გვერდი, რომელიც მოიცავს მთავარ სექციებს, ნავიგაციას. შექმენი საიტის მთავარი გვერდი, რომელიც მოიცავს მთავარ სექციებს, ნავიგაციას. შექმენი საიტის მთავარი გვერდი, რომელიც მოიცავს მთავარ სექციებს, ნავიგაციას. eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee შექმენი საიტის მთავარი გვერდი, რომელიც მოიცავს მთავარ სექციებს, ნავიგაციას.                       ',
    due_date: new Date('2023-07-09'),
    status: { id: 1, name: 'test', icon: 'test' },
    priority: {
      id: 2,
      name: 'საშუალო',
      icon: 'https://www.pacific-research.com/wp-content/uploads/2020/05/medium-icon.png',
    },
    department: { id: 1, name: 'დიზაინი' },
    employee: {
      id: 1,
      name: 'Danny Davito',
      surname: 'test',
      avatar: 'https://pbs.twimg.com/media/FhzlIPvUYAA7lIl.jpg',
      department_id: 1,
    },
  };

  departments: Department[] = [
    {
      id: 1,
      name: 'ადმინისტრაციის დეპარტამენტი',
    },
    {
      id: 2,
      name: 'ადამიანური რესურსების დეპარტამენტი',
    },
    {
      id: 3,
      name: 'ფინანსების დეპარტამენტი',
    },
    {
      id: 4,
      name: 'გაყიდვები და მარკეტინგის დეპარტამენტი',
    },
    {
      id: 5,
      name: 'ლოჯოსტიკის დეპარტამენტი',
    },
    {
      id: 6,
      name: 'ტექნოლოგიების დეპარტამენტი',
    },
    {
      id: 7,
      name: 'მედიის დეპარტამენტი',
    },
  ];

  statuses: Status[] = [
    {
      id: 1,
      name: 'დასაწყები',
    },
    {
      id: 2,
      name: 'პროგრესში',
    },
    {
      id: 3,
      name: 'მზად ტესტირებისთვის',
    },
    {
      id: 4,
      name: 'დასრულებული',
    },
  ];

  resolveImgSrc(src?: string): string {
    if (src && src.length > 0) {
      return src;
    }
    return 'no-image.svg';
  }

  getDepartmentNameById(id: number): string {
    const department = this.departments.find((dep) => dep.id === id);
    return department?.name ?? 'უცნობი დეპარტამენტი';
  }
}
