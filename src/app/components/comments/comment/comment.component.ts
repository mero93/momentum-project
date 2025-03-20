import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentInterface } from '../../../interfaces/commentInterface';
import { CommentFieldComponent } from '../comment-field/comment-field.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [CommentFieldComponent, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  replyToggle: boolean = false;
  @Input() comment!: CommentInterface;

  @Output() replySubmitted = new EventEmitter<{
    text: string;
    parent_id?: number;
  }>();

  showReplyInput() {
    this.replyToggle = !this.replyToggle;
  }

  onReplySubmitted(event: { text: string; parent_id?: number }) {
    this.replyToggle = false;
    this.replySubmitted.emit(event);
  }
}
