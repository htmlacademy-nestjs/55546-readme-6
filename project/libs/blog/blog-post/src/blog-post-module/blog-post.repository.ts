import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientService } from '@project/blog-models';
import { Post } from '@project/shared/core';
import { BasePostgresRepository } from '@project/data-access';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { MAX_POST_LIMIT, PostFilter, postFilterToPrismaFilter } from './blog-post.filter';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<BlogPostEntity, Post> {
  constructor(
    entityFactory: BlogPostFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async save(entity: BlogPostEntity): Promise<void> {
    const record = await this.client.post.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const document = await this.client.post.findFirst({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document as any);
  }

  public async find(filter?: PostFilter): Promise<BlogPostEntity[]> {
    const where = filter ?? postFilterToPrismaFilter(filter);
    const documents = await this.client.post.findMany({
      where,
      take: MAX_POST_LIMIT
    });

    return documents.map((document) => this.createEntityFromDocument(document as any));
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: { id }
    });
  }

  public async update(entity: BlogPostEntity): Promise<void> {
    await this.client.post.update({
      where: { id: entity.id },
      data: { ...entity.toPOJO() }
    });
  }

  public async findByIds(ids: string[]): Promise<BlogPostEntity[]> {
    const records = await this.client.post.findMany({
      where: {
        id: { in: ids }
      }
    });

    return records.map((record) => this.createEntityFromDocument(record as any));
  }
}
