import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { AddEmployeeModalComponent } from '../add-employee-modal/add-employee-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import {
  MatMomentDateModule,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';
import 'moment/locale/ka';

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
  templateUrl: './task-edition-page.component.html',
  styleUrl: './task-edition-page.component.scss',
})
export class TaskEditionPageComponent implements OnInit {
  modalToggle: boolean = false;
  readonly minDate = new Date();
  departmentIndex = 0;
  form!: FormGroup;

  ///temprorary///
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

  priorities: Priority[] = [
    {
      id: 1,
      name: 'დაბალი',
      icon: 'https://momentum.redberryinternship.ge/storage/priority-icons/Low.svg',
    },
    {
      id: 2,
      name: 'საშუალო',
      icon: 'https://momentum.redberryinternship.ge/storage/priority-icons/Medium.svg',
    },
    {
      id: 3,
      name: 'მაღალი',
      icon: 'https://momentum.redberryinternship.ge/storage/priority-icons/High.svg',
    },
  ];

  employees: Employee[] = [
    {
      id: 1,
      name: 'ემილია',
      surname: 'მორგანო',
      avatar: 'https://pbs.twimg.com/media/FhzlIPvUYAA7lIl.jpg',
      department_id: 1,
    },
    {
      id: 2,
      name: 'danny',
      surname: 'devito',
      avatar: 'https://pbs.twimg.com/media/FhzlIPvUYAA7lIl.jpg',
      department_id: 2,
    },
  ];
  ///temprorary///

  constructor(private fb: FormBuilder, private dateAdapter: DateAdapter<any>) {}

  ngOnInit(): void {
    console.log(this.priorities.filter((x) => x.id === 2)[0]);
    this.dateAdapter.setLocale('ka');
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.minLength(3),
          Validators.maxLength(255),
          Validators.required,
        ],
      ],
      description: ['', [Validators.minLength(4), Validators.maxLength(255)]],
      due_date: [
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        [Validators.required],
      ],
      status_id: [
        this.statuses.filter((x) => x.id === 1)[0],
        [Validators.required],
      ],
      priority_id: [
        this.priorities.filter((x) => x.id === 2)[0],
        [Validators.required],
      ],
      department_id: ['', [Validators.required]],
      employee_id: ['', [Validators.required, this.checkDepartments()]],
    });
    // this.form.controls.due_date.setValue(
    //   new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toString()
    // );
    this.form.controls.status_id.markAsTouched();
    this.form.controls.priority_id.markAsTouched();
    this.form.controls.department_id.valueChanges.subscribe((x) => {
      if (x.id !== this.departmentIndex) {
        this.form.controls.employee_id.setValue('');
        this.departmentIndex = x.id;
        this.form.controls.employee_id.updateValueAndValidity();
        this.form.controls.employee_id.markAsTouched();
        this.form.controls.department_id.markAsTouched();
      }
    });
  }

  checkDepartments(): ValidatorFn {
    return (control: AbstractControl) => {
      const val = (control?.parent?.controls as any)?.department_id?.value;
      return val && val.id !== 0 ? null : { departmentEmpty: true };
    };
  }

  submit() {
    console.log('form', this.form);
  }

  openModal() {
    console.log('modal should open');
    this.modalToggle = true;
  }

  onCloseModal() {
    this.modalToggle = false;
  }
}
