import { Injectable } from "@nestjs/common";

import { AuthUser, EntityFactory } from "@project/shared/core";
import { BlogUserEntity } from "./blog-user.entity";

@Injectable()
export class BlogUserFactory implements EntityFactory<BlogUserEntity> {
  create(entityPlainData: AuthUser): BlogUserEntity {
    return new BlogUserEntity(entityPlainData);
  }
}
