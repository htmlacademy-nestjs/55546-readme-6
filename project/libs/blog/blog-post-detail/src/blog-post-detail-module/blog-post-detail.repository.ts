import { PostDetailItem } from "@project/shared/core";
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from "@project/blog-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogPostDetailFactory } from "./blog-post-detail.factory";
import { BlogPostDetailEntity } from "./blog-post-detail.entity";

@Injectable()
export class BlogPostDetailRepository extends BasePostgresRepository<BlogPostDetailEntity, PostDetailItem> {
  constructor(
    entityFactory: BlogPostDetailFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: BlogPostDetailEntity): Promise<void> {
    const record = await this.client.postsDetails.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async findById(id: string): Promise<BlogPostDetailEntity> {
    const document = await this.client.postsDetails.findFirst({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.postsDetails.delete({
      where: { id }
    });
  }

  public async findByPostId(postId: string): Promise<BlogPostDetailEntity[]> {
    const records = await this.client.postsDetails.findMany({
      where: { postId }
    });

    return records.map(record => this.createEntityFromDocument(record))
  }
}

