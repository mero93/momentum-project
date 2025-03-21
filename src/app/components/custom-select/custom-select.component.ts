import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  imports: [CommonModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class CustomSelectComponent implements ControlValueAccessor, OnInit {
  required: boolean = false;

  toggle: boolean = false;
  @Input() disabled: boolean = false;
  @Input() width: number = 550;
  @Input() items: any[] = [];
  @Input() type: string | undefined;

  @Output() openModal = new EventEmitter<void>();

  constructor(
    @Self() public ngControl: NgControl,
    private element: ElementRef
  ) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.required =
      this.ngControl.control?.hasValidator(Validators.required) ?? false;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  onClick(event: any) {
    if (!this.element.nativeElement.contains(event.target)) {
      console.log('clicked outside');
      if (this.toggle && !this.ngControl.control?.touched) {
        this.ngControl.control?.markAsTouched();
      }
      this.toggle = false;
    }
  }

  toggleDropdown() {
    if (this.toggle && !this.ngControl.control?.touched) {
      this.ngControl.control?.markAsTouched();
    }
    this.toggle = !this.toggle;
  }

  selectItem(item: any) {
    this.ngControl.control?.setValue(item);
    this.toggle = false;
  }

  onOpenModal() {
    console.log('fired from custom-select');
    this.openModal.emit();
  }
}
