import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { FileHandler } from '../interfaces/file-handler';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDragNDrop]',
})
export class DragNDropDirective {
  @HostBinding('style.background-color') private background = '#fff';
  @Output() fileUpload: EventEmitter<FileHandler | undefined> =
    new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#fff';
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.background = '#fff';

    let fileHandler: FileHandler;

    if (event.dataTransfer) {
      const file = event.dataTransfer.files[0];

      if (file.type.indexOf('image') === -1 || file.size > 600000) {
        console.log(file.type);
        this.fileUpload.emit();
        return;
      }

      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );

      fileHandler = { file, url };
      console.log('file', fileHandler);
      this.fileUpload.emit(fileHandler);
    }
  }
}
