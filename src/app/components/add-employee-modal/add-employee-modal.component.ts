import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Department } from '../../interfaces/department';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { TextInputComponent } from '../text-input/text-input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DragNDropDirective } from '../../directives/drag-n-drop.directive';
import { SafeUrl } from '@angular/platform-browser';
import { FileHandler } from '../../interfaces/file-handler';
import { CommonModule } from '@angular/common';
import { StopPropagationDirective } from '../../directives/stop-propagation.directive';

const PATTERN = '^[a-zA-Zა-ჰ]+$';

@Component({
  selector: 'app-add-employee-modal',
  imports: [
    CommonModule,
    CustomSelectComponent,
    TextInputComponent,
    FormsModule,
    ReactiveFormsModule,
    DragNDropDirective,
    StopPropagationDirective,
  ],
  templateUrl: './add-employee-modal.component.html',
  styleUrl: './add-employee-modal.component.scss',
})
export class AddEmployeeModalComponent implements OnInit {
  imgUrl: string | SafeUrl = 'no-image.svg';
  uploadStatus: number = 0;
  form!: FormGroup;

  @Input() depId?: number;
  @Input() departments: Department[] = [];

  @Output() closeModal = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(255),
          Validators.required,
          Validators.pattern(PATTERN),
        ],
      ],
      surname: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(255),
          Validators.required,
          Validators.pattern(PATTERN),
        ],
      ],
      department_id: [
        this.depId
          ? this.departments.filter((x) => x.id === this.depId)[0]
          : '',
        [Validators.required],
      ],
      avatar: ['', [Validators.required]],
    });
    this.form.controls.department_id.valueChanges.subscribe(() =>
      this.form.controls.department_id.markAsTouched()
    );
  }

  onCloseModal() {
    this.closeModal.emit();
  }

  onFileUpload(fileHandler?: FileHandler) {
    if (fileHandler) {
      this.uploadStatus = 1;
      this.imgUrl = fileHandler.url;
      this.form.controls.avatar.setValue(fileHandler.file);
    } else {
      this.deleteFile();
    }
  }
  deleteFile() {
    this.form.controls.avatar.setValue('');
    this.uploadStatus = 2;
    this.imgUrl = 'no-image.svg';
  }
}
