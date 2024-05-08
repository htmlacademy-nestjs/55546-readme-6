import { Injectable } from "@nestjs/common";
import { EntityFactory, PostDetailItem } from "@project/shared/core";
import { BlogPostDetailEntity } from "./blog-post-detail.entity";

@Injectable()
export class BlogPostDetailFactory implements EntityFactory<BlogPostDetailEntity> {
  public create(entityPlainData: PostDetailItem): BlogPostDetailEntity {
    return new BlogPostDetailEntity(entityPlainData);
  }
}
