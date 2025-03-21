import { Component, Input, OnInit } from '@angular/core';
import { CommentInterface } from '../../../interfaces/commentInterface';
import { CommentFieldComponent } from '../comment-field/comment-field.component';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { ApiConnectionService } from '../../../services/api-connection.service';

@Component({
  selector: 'app-comment-section',
  imports: [CommentFieldComponent, CommonModule, CommentComponent],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent implements OnInit {
  constructor(private api: ApiConnectionService) {}

  @Input() taskId!: number;

  comments!: CommentInterface[];

  ngOnInit(): void {
    this.loadComments();
  }

  commentSubmitted(event: { text: string; parent_id?: number }) {
    this.api
      .addComment(this.taskId, event.text, event.parent_id)
      .subscribe((res) => {
        if (!res.parent_id) {
          this.comments.push(res);
        } else {
          const parentComment = this.comments.find(
            (comment) => comment.id === res.parent_id
          );
          if (parentComment?.sub_comments) {
            parentComment.sub_comments.push(res);
          } else {
            parentComment!.sub_comments = [res];
          }
        }
        console.log('submitted', res);
      });
  }

  loadComments() {
    this.api.getComments(this.taskId).subscribe((res) => (this.comments = res));
  }

  calculateTotalComments(): number {
    let total = 0;
    this.comments.forEach((comment) => {
      total += 1;
      if (comment.sub_comments) {
        total += comment.sub_comments.length;
      }
    });
    return total;
  }
}
