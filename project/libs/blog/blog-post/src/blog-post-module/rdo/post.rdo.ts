import { PostStatus, PostType } from '@project/shared/core';
import { Expose } from 'class-transformer';

export class PostRdo {
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
}
