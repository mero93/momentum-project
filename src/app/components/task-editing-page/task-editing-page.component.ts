import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Department } from '../../interfaces/department';
import { Employee } from '../../interfaces/employee';
import { Priority } from '../../interfaces/priority';
import { Status } from '../../interfaces/status';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';
import { StopPropagationDirective } from '../../directives/stop-propagation.directive';
import { CommonModule, DatePipe, DOCUMENT } from '@angular/common';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { AddEmployeeModalComponent } from '../add-employee-modal/add-employee-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import 'moment/locale/ka';
import { ApiConnectionService } from '../../services/api-connection.service';
import { debounceTime, forkJoin, take } from 'rxjs';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-task-edition-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    StopPropagationDirective,
    CustomSelectComponent,
    AddEmployeeModalComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  templateUrl: './task-editing-page.component.html',
  styleUrl: './task-editing-page.component.scss',
  providers: [DatePipe],
})
export class TaskEditionPageComponent implements OnInit {
  modalToggle: boolean = false;
  readonly minDate = new Date();
  departmentIndex = 0;
  form!: FormGroup;

  departments!: Department[];

  statuses!: Status[];

  priorities!: Priority[];

  employees!: Employee[];

  employeesByDepartment: Employee[] = [];

  storedTask: Task = {};

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private api: ApiConnectionService,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (this.document.defaultView?.localStorage) {
      const data = this.document.defaultView.localStorage.getItem('task');
      if (data) {
        this.storedTask = JSON.parse(data);
        console.log('data restored', this.storedTask);
      }
    }
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('ka');
    this.getDataFromApi();
  }

  getDataFromApi() {
    if (
      this.api.departments &&
      this.api.statuses &&
      this.api.priorities &&
      this.api.employees
    ) {
      console.log('getting data from service');
      this.departments = this.api.departments;
      this.statuses = this.api.statuses;
      this.priorities = this.api.priorities;
      this.employees = this.api.employees;
      this.buildForm();
    } else {
      forkJoin([
        this.api.getDepartments(),
        this.api.getStatuses(),
        this.api.getPriorities(),
        this.api.getEmployees(),
      ])
        .pipe(take(1))
        .subscribe(
          ([departments, statuses, priorities, employees]) => {
            console.log('getting data from api');
            this.departments = departments;
            this.statuses = statuses;
            this.priorities = priorities;
            this.employees = employees;
            this.buildForm();
          },

          (error) => console.log(error)
        );
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        this.storedTask.name ?? '',
        [
          Validators.minLength(3),
          Validators.maxLength(255),
          Validators.required,
        ],
      ],
      description: [
        this.storedTask.description ?? '',
        [Validators.minLength(4), Validators.maxLength(255)],
      ],
      due_date: [
        this.storedTask.due_date ??
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        [Validators.required],
      ],
      status: [
        this.storedTask.status ?? this.statuses.filter((x) => x.id === 1)[0],
        [Validators.required],
      ],
      priority: [
        this.storedTask.priority ??
          this.priorities.filter((x) => x.id === 2)[0],
        [Validators.required],
      ],
      department: [this.storedTask.department ?? '', [Validators.required]],
      employee: [
        this.storedTask.employee ?? '',
        [Validators.required, this.checkDepartments()],
      ],
    });
    this.form.controls.status.markAsTouched();
    this.form.controls.priority.markAsTouched();
    this.form.controls.department.valueChanges.subscribe((x) => {
      if (x.id !== this.departmentIndex) {
        this.form.controls.employee.setValue('');
        this.employeesByDepartment = this.employees.filter(
          (e) => e.department.id === x.id
        );
        this.departmentIndex = x.id;
        this.form.controls.employee.markAsTouched();
        this.form.controls.department.markAsTouched();
        this.form.controls.department.markAsDirty();
      }
    });
    this.form.controls.employee.valueChanges.subscribe((x) => {
      this.form.controls.employee.markAsDirty();
    });
    this.form.controls.status.valueChanges.subscribe((x) => {
      this.form.controls.status.markAsDirty();
    });
    this.form.controls.priority.valueChanges.subscribe((x) => {
      this.form.controls.priority.markAsDirty();
    });
    this.form.valueChanges.pipe(debounceTime(1000)).subscribe((x) => {
      if (this.form.dirty) {
        localStorage.setItem('task', JSON.stringify(this.form.value));
        console.log('data stored');
      }
    })
  }


  checkDepartments(): ValidatorFn {
    return (control: AbstractControl) => {
      const val = (control?.parent?.controls as any)?.department?.value;
      return val && val.id !== 0 ? null : { departmentEmpty: true };
    };
  }

  onSubmit() {
    const task = this.form.value;
    task.due_date = this.datePipe.transform(task.due_date, 'yyyy-MM-dd');
    this.api.addTask(task).subscribe((res) => console.log(res));
    this.buildForm();
  }

  openModal() {
    console.log('modal should open');
    this.modalToggle = true;
  }

  onCloseModal(changes: boolean) {
    if (changes) {
      let confirmed = window.confirm('გსურთ ფანჯრის დახურვა?');
      if (!confirmed) return;
    }

    this.modalToggle = false;
  }

  onEmployeeSubmit(event: Employee) {
    this.api.addEmployee(event).subscribe((res) => {
      const employee = res as Employee;
      console.log(res);
      this.employees.push(employee);
      this.employeesByDepartment = this.employees.filter(
        (e) => e.department.id === employee.department!.id
      );
      this.form.controls.department.setValue(employee.department!);
      this.form.controls.employee.setValue(employee);
      this.modalToggle = false;
    });
  }

  // randomiseTasks() {
  //   let i = 1;
  //   while (i <= 10) {
  //     const task: any = {};
  //     task.name = `Random task ${i}`;
  //     task.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  //         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;
  //     task.due_date = this.datePipe.transform(
  //       new Date(
  //         new Date().getTime() + 24 * 60 * 60 * 1000 * this.getRandomInt(30)
  //       ),
  //       'yyyy-MM-dd'
  //     );
  //     task.status = this.statuses[this.getRandomInt(this.statuses.length)];
  //     task.priority =
  //       this.priorities[this.getRandomInt(this.priorities.length)];
  //     task.department =
  //       this.departments[this.getRandomInt(this.departments.length)];
  //     this.employeesByDepartment = this.employees.filter(
  //       (e) => e.department.id === task.department.id
  //     );
  //     task.employee =
  //       this.employeesByDepartment[
  //         this.getRandomInt(this.employeesByDepartment.length)
  //       ];
  //     this.api.addTask(task).subscribe((res) => console.log(res));
  //     i++;
  //   }
  // }

  // getRandomInt(max: number) {
  //   return Math.floor(Math.random() * max);
  // }
}
