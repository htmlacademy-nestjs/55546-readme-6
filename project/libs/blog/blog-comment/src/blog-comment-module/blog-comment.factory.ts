import { Comment, EntityFactory } from "@project/shared/core";
import { BlogCommentEntity } from "./blog-comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";

export class BlogCommentFactory implements EntityFactory<BlogCommentEntity> {
  create(entityPlainData: Comment): BlogCommentEntity {
    return new BlogCommentEntity(entityPlainData);
  }

  public createFromDto(dto: CreateCommentDto, postId: string): BlogCommentEntity {
    return new BlogCommentEntity({
      ...dto,
      id: undefined,
      postId,
      dateCreate: new Date()
    });
  }
}
