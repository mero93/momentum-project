import { Component, Input } from '@angular/core';
import { Task } from '../../interfaces/task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() color: string = '';

  resolveDescription(description: string): string {
    const whiteSpaceRemoved = description.trim();
    return whiteSpaceRemoved.length > 100
      ? whiteSpaceRemoved.slice(0, 100) + '...'
      : whiteSpaceRemoved;
  }

  resolveImgSrc(src?: string): string {
    if (src && src.length > 0) {
      return src;
    }
    return 'no-image.svg';
  }
}
