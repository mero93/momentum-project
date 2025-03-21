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
  constructor(private api: ApiConnectionService, private router: Router) {}

  ngOnInit(): void {
    this.loadTask();
    this.loadStatuses();
  }

  task!: Task;

  statusId!: number;

  statuses!: Status[];

  resolveImgSrc(src?: string): string {
    if (src && src.length > 0) {
      return src;
    }
    return 'no-image.svg';
  }

  loadTask() {
    this.api
      .getTaskById(Number(this.router.url.split('/')[2]))
      .subscribe((res) => {
        this.task = res;
        this.statusId = this.task.status!.id!;
      });
  }

  loadStatuses() {
    if (this.statuses) {
      this.statuses = this.statuses;
    } else {
      this.api.getStatuses().subscribe((res) => (this.statuses = res));
    }
  }

  selectStatus(): Status {
    return this.statuses.find((status) => 
      status.id === Number(this.statusId))!;
  }

  updateTaskStatus() {
    this.task.status = this.selectStatus();
    this.api.changeTaskStatus(this.statusId, this.task.id!).subscribe();
  }
}
