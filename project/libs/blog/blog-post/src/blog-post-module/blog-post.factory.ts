import { Injectable } from "@nestjs/common";
import { CommonPostType, EntityFactory } from "@project/shared/core";
import { BlogPostEntity } from "./blog-post.entity";

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  public create(entityPlainData: CommonPostType): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }
}
