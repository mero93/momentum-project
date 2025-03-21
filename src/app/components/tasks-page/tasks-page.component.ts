import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Status } from '../../interfaces/status';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { Department } from '../../interfaces/department';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Employee } from '../../interfaces/employee';
import { Priority } from '../../interfaces/priority';
import { forkJoin, take } from 'rxjs';
import { TaskFilter } from '../../interfaces/task-filter';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-page',
  imports: [TaskCardComponent, TaskFilterComponent, CommonModule],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent implements OnInit {
  constructor(private api: ApiConnectionService) {}

  structuredTaskList!: { status: Status; tasks: Task[] }[];

  departments!: Department[];

  employees!: Employee[];

  priorities!: Priority[];

  ngOnInit(): void {
    this.getStructuredTaskList();
    this.prepareFilterInfo();
  }

  getAll() {
    console.log('inside getAll()');
    this.api.getTasks().subscribe();
    this.api.getStatuses().subscribe();
    this.api.getPriorities().subscribe();
    this.api.getDepartments().subscribe();
    this.api.getEmployees().subscribe();
  }

  getStructuredTaskList(filter?: TaskFilter) {
    if (!this.api.statuses && !this.api.tasks) {
      forkJoin([this.api.getTasks(), this.api.getStatuses()])
        .pipe(take(1))
        .subscribe(([tasks, statuses]) => {
          console.log('getting tasks and statuses from api');
          if (filter) {
            tasks = this.filterTasks(filter, tasks);
          }
          this.structuredTaskList = statuses.map((status) => ({
            status: status,
            tasks: tasks.filter((task) => task.status?.id === status.id),
          }));
        });
    } else if (!this.api.tasks) {
      console.log('getting statuses from service');
      this.api.getTasks().subscribe((tasks) => {
        if (filter) {
          tasks = this.filterTasks(filter, tasks);
        }
        this.structuredTaskList = this.api.statuses.map((status) => ({
          status: status,
          tasks: tasks.filter((task) => task.status?.id === status.id),
        }));
      });
    } else if (!this.api.statuses) {
      console.log('getting tasks from service');
      let tasks: Task[] = this.api.tasks;
      if (filter) {
        tasks = this.filterTasks(filter, tasks);
      }
      this.api.getStatuses().subscribe((statuses) => {
        this.structuredTaskList = statuses.map((status) => ({
          status: status,
          tasks: tasks.filter((task) => task.status?.id === status.id),
        }));
      });
    } else {
      console.log('using stored tasks and statuses from service');
      let tasks: Task[] = this.api.tasks;
      if (filter) {
        tasks = this.filterTasks(filter, tasks);
      }
      this.structuredTaskList = this.api.statuses.map((status) => ({
        status: status,
        tasks: tasks.filter((task) => task.status?.id === status.id),
      }));
    }
  }

  private filterTasks(filter: TaskFilter, tasks: Task[]) {
    return tasks.filter((task) => {
      return (
        (filter.departments.length === 0 ||
          filter.departments.some((d) => d.id === task.department?.id)) &&
        (filter.priorities.length === 0 ||
          filter.priorities.some((p) => p.id === task.priority?.id)) &&
        (filter.employee === undefined ||
          filter.employee.id === task.employee?.id)
      );
    });
  }

  prepareFilterInfo() {
    if (this.api.departments) {
      this.departments = this.api.departments;
    } else {
      this.api.getDepartments().subscribe((departments) => {
        this.departments = departments;
      });
    }

    if (this.api.priorities) {
      this.priorities = this.api.priorities;
    } else {
      this.api.getPriorities().subscribe((priorities) => {
        this.priorities = priorities;
      });
    }

    if (this.api.employees) {
      this.employees = this.api.employees;
    } else {
      this.api.getEmployees().subscribe((employees) => {
        this.employees = employees;
      });
    }
  }
}
