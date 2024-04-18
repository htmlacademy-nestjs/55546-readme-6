import { Comment, EntityFactory } from "@project/shared/core";
import { BlogCommentEntity } from "./blog-comment.entity";


export class BlogCommentFactory implements EntityFactory<BlogCommentEntity> {
  create(entityPlainData: Comment): BlogCommentEntity {
    return new BlogCommentEntity(entityPlainData);
  }
}
