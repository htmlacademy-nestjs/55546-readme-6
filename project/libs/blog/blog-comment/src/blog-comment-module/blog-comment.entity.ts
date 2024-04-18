import { Comment, Entity, StorableEntity } from '@project/shared/core';

export class BlogCommentEntity extends Entity implements StorableEntity<Comment> {
  public dateCreate: Date;
  public authorId: string;
  public postId: string;
  public message: string;

  constructor(comment?: Comment) {
    super();
    this.populate(comment);
  }

  public populate(comment?: Comment): void {
    if (!comment) {
      return;
    }

    this.id = comment.id ?? undefined;
    this.postId = comment.postId;
    this.authorId = comment.authorId;
    this.message = comment.message;
    this.dateCreate = comment.dateCreate;
  }

  toPOJO(): Comment {
    return {
      id: this.id,
      postId: this.postId,
      authorId: this.authorId,
      message: this.message,
      dateCreate: this.dateCreate
    };
  }
}
