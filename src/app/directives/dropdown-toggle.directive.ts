import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[dropdownToggle]',
})
export class DropdownToggleDirective implements AfterViewInit, OnDestroy {
  @Input() id: any;
  subscription?: Subscription;
  @Output() clickOutside = new EventEmitter<void>();
  constructor(
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.subscription = fromEvent(this.document, 'click')
      .pipe(
        filter((event) => {
          return !this.isInside(event?.target as HTMLElement);
        })
      )
      .subscribe(() => {
        // console.log('clicked outside', this._elRef.nativeElement);
        this.clickOutside.emit();
      });
  }

  private isInside(elementToCheck: HTMLElement): boolean {
    console.log('element to check', elementToCheck);
    console.log('this element', this.element.nativeElement);
    return elementToCheck === this.element.nativeElement;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

// (elementToCheck === this._elRef.nativeElement && elementToCheck.id === this._elRef.nativeElement.id) ||
//       elementToCheck?.contains(this._elRef.nativeElement)
