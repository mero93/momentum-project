export interface Comment {
  id?: number;
  text?: string;
  task_id?: number;
  parent_id?: number;
  author_avatar?: string;
  author_nickname?: string;
  sub_comments?: Comment[];
}
