import { Component } from '@angular/core';
import { CommentInterface } from '../../../interfaces/commentInterface';
import { CommentFieldComponent } from '../comment-field/comment-field.component';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-comment-section',
  imports: [CommentFieldComponent, CommonModule, CommentComponent],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent {
  comments: CommentInterface[] = [
    {
      id: 1,
      text: 'ეს დავალება საერთიდ არ არის რთული',
      task_id: 1,
      author_avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.1',
      author_nickname: 'Gela',
      sub_comments: [
        {
          id: 2,
          text: 'ვისთვის როგორ',
          task_id: 1,
          parent_id: 1,
          author_avatar:
            'https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2',
          author_nickname: 'Lela',
        },
      ],
    },
  ];

  commentSubmitted(event: { text: string; parent_id?: number }) {
    console.log('submitted', event);
  }
}
