import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status } from '../interfaces/status';
import { Priority } from '../interfaces/priority';
import { Department } from '../interfaces/department';
import { Employee } from '../interfaces/employee';
import { Task } from '../interfaces/task';
import { map, Observable, Subscriber } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommentInterface } from '../interfaces/commentInterface';

const API_SERVER = 'https://momentum.redberryinternship.ge/api/';

@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService {
  statuses!: Status[];
  priorities!: Priority[];
  departments!: Department[];
  employees!: Employee[];
  tasks!: Task[];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getStatuses() {
    return this.http.get(API_SERVER + 'statuses').pipe(
      map((res) => {
        console.log('statuses', res);
        this.statuses = res as Status[];
        return this.statuses;
      })
    );
  }

  getPriorities() {
    return this.http.get(API_SERVER + 'priorities').pipe(
      map((res) => {
        console.log('priorities', res);
        this.priorities = res as Priority[];
        return this.priorities;
      })
    );
  }

  getDepartments() {
    return this.http.get(API_SERVER + 'departments').pipe(
      map((res) => {
        console.log('departments', res);
        this.departments = res as Department[];
        return this.departments;
      })
    );
  }

  getEmployees() {
    return this.http.get(API_SERVER + 'employees').pipe(
      map((res) => {
        console.log('employees', res);
        this.employees = res as Employee[];
        return this.employees;
      })
    );
  }

  addEmployee(employee: Employee) {
    const formData = new FormData();
    formData.append('name', employee.name!);
    formData.append('surname', employee.surname!);
    formData.append('avatar', employee.avatar!);
    formData.append('department_id', employee.department!.id!.toString());
    return this.http.post(API_SERVER + 'employees', formData).pipe(
      map((res) => {
        this.toastr.success('თანამშრომელი წარმატებით დაემატა');
        if (this.employees) {
          this.employees.push(res as Employee);
        }
        return res;
      })
    );
  }

  getComments(taskId: number) {
    return this.http.get(API_SERVER + 'tasks/' + taskId + '/comments').pipe(
      map((res) => {
        console.log('comments', res);
        return res as CommentInterface[];
      })
    );
  }

  addComment(comment: CommentInterface) {
    return this.http.post(API_SERVER + 'comments', comment).pipe(
      map((res) => {
        console.log('comment', res);
        return res;
      })
    );
  }

  getTasks() {
    return this.http.get(API_SERVER + 'tasks').pipe(
      map((res) => {
        console.log('tasks', res);
        this.tasks = res as Task[];
        return this.tasks;
      })
    );
  }

  getTaskById(id: number) {
    return this.http.get(API_SERVER + 'tasks/' + id).pipe(
      map((res) => {
        console.log('tasks', res);
        return res as Task;
      })
    );
  }

  addTask(task: any) {
    const formData = new FormData();

    formData.append('name', task.name!);
    formData.append('description', task.description);
    formData.append('due_date', task.due_date);
    formData.append('status_id', task.status.id.toString());
    formData.append('employee_id', task.employee.id.toString());
    formData.append('priority_id', task.priority.id.toString());

    return this.http.post(API_SERVER + 'tasks', formData).pipe(
      map((res) => {
        console.log('tasks', res);
        if (this.tasks) {
          this.tasks.push(res as Task);
        }

        return res as Task;
      })
    );
  }

  changeTaskStatus(status: number, id: number) {
    return this.http.put(API_SERVER + 'tasks/' + id, status).pipe(
      map((res) => {
        if (this.tasks) {
          this.tasks = this.tasks.map((task) => {
            if (task.id === id) {
              task.status = this.statuses.find(
                (status) => status.id === status
              );
            }
            return task;
          });
        }
        return res;
      })
    );
  }
}
