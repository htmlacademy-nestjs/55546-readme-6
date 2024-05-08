import { Entity, PostDetailItem } from '@project/shared/core';
import { StorableEntity } from '@project/shared/core';
import { PostDetailType } from '@prisma/client';

export class BlogPostDetailEntity extends Entity implements StorableEntity<PostDetailItem> {
  public postId: string;
  public type: PostDetailType;
  public value: string;

  constructor(detail?: PostDetailItem) {
    super();
    this.populate(detail);
  }

  public populate(detail?: PostDetailItem) {
    if (!detail) {
      return;
    }

    this.id = detail.id ?? undefined;
    this.postId = detail.postId ?? undefined;
    this.type = detail.type ?? undefined;
    this.value = detail.value ?? undefined;
  }

  public toPOJO(): PostDetailItem {
    return {
      id: this.id,
      postId: this.postId,
      type: this.type,
      value: this.value
    };
  }
}

