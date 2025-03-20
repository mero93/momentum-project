import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-field',
  imports: [FormsModule],
  templateUrl: './comment-field.component.html',
  styleUrl: './comment-field.component.scss',
})
export class CommentFieldComponent {
  text: string = '';
  disabled: boolean = false;
  @Input() parent_id?: number;

  @Output() commentSubmitted = new EventEmitter<{
    text: string;
    parent_id?: number;
  }>();

  checkComment() {
    const trueText = this.text.trim();
    if (trueText.length >= 2) {
      return false;
    }
    return true;
  }

  onSubmit() {
    this.commentSubmitted.emit({ text: this.text, parent_id: this.parent_id });
  }
}
