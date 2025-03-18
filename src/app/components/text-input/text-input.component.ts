import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnInit,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  required: boolean = false;
  @Input() minLength: number | undefined;
  @Input() maxLength: number | undefined;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  ngOnInit(): void {
    this.required =
      this.ngControl.control?.hasValidator(Validators.required) ?? false;
  }
  @Input() isTextArea: boolean = false;

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
