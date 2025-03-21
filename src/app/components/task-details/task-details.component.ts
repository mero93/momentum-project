import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { CommonModule, DatePipe } from '@angular/common';
import { Department } from '../../interfaces/department';
import { Status } from '../../interfaces/status';
import { FormsModule } from '@angular/forms';
import { CommentSectionComponent } from '../comments/comment-section/comment-section.component';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe, CommonModule, FormsModule, CommentSectionComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit {
  constructor(
    private apiConnection: ApiConnectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiConnection
      .getTaskById(Number(this.router.url.split('/')[2]))
      .subscribe((res) => (this.task = res));
  }

  task!: Task;

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

  updateTaskStatus() {
    console.log('update task status', this.task.status);
    //this.apiConnection.updateTaskStatus(this.task).subscribe();
  }
}
