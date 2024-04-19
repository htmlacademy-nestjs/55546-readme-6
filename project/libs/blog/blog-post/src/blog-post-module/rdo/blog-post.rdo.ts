import { Comment, PostStatus, PostType } from '@project/shared/core';
import { Expose } from 'class-transformer';

export class BlogPostRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public type: PostType

  @Expose()
  public status: PostStatus;

  @Expose()
  public authorId: string;

  @Expose()
  public tags: string[];

  @Expose()
  public likes: string[];

  @Expose()
  public comments: Comment[];
}
