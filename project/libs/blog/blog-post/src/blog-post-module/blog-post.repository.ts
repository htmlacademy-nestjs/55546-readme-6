import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientService } from '@project/blog-models';
import { PaginationResult, Post } from '@project/shared/core';
import { BasePostgresRepository } from '@project/data-access';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { PostStatus, Prisma } from '@prisma/client';
import { BlogPostQuery } from './blog-post.query';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<BlogPostEntity, Post> {
  constructor(
    entityFactory: BlogPostFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  private getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async save(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();

    await this.client.postsDetails.deleteMany({ where: { postId: pojoEntity.id } });

    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        comments: {
          connect: []
        },
        postsDetails: {
          create: entity.postsDetails.map(({ type, value }) => ({ type, value }))
        }
      }
    });

    entity.id = record.id;
  }

  public async update(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();

    await this.client.postsDetails.deleteMany({ where: { postId: pojoEntity.id } });

    await this.client.post.update({
      where: { id: entity.id },
      data: {
        title: pojoEntity.title,
        type: pojoEntity.type,
        status: pojoEntity.status,
        tags: pojoEntity.tags,
        postsDetails: {
          create: entity.postsDetails.map(({ type, value }) => ({ type, value }))
        }
      },
      include: { comments: true }
    });
  }

  public async like(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    await this.client.post.update({
      where: { id: entity.id },
      data: { likes: pojoEntity.likes }
    });
  }

  public async repost(entity: BlogPostEntity, authorId: string): Promise<BlogPostEntity> {
    const { id, ...pojoEntity } = entity.toPOJO();

    const record = await this.client.post.create({
      data: {
        ...pojoEntity,

        originalId: id,
        authorId,
        originalAuthorId: entity.authorId,
        dateCreate: new Date(),
        dateUpdate: new Date(),
        isReposted: true,
        comments: {
          connect: []
        },
        postsDetails: {
          create: entity.postsDetails.map(({ type, value }) => ({ type, value }))
        }
      }
    });

    entity.id = record.id;

    return entity;
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const document = await this.client.post.findFirst({
      where: { id },
      include: { comments: true, postsDetails: true }
    });

    if (!document) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document)
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } });
  }

  public async find(query?: BlogPostQuery, isOnlyDraft = false): Promise<PaginationResult<BlogPostEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    where.status = isOnlyDraft ? PostStatus.Draft : PostStatus.Published;

    if (query?.sortByComments) {
      orderBy.comments = { _count: query.sortByComments };
    } else if (query?.sortByLikes) {
      orderBy.likes = query.sortByLikes;
    } else if (query?.sortDirection) {
      orderBy.dateCreate = query.sortDirection;
    }

    if (query?.title) {
      where.title = { contains: query.title };
    }

    if (query?.type) {
      where.type = query.type;
    }

    if (query?.authorId) {
      where.authorId = query.authorId;
    }

    if (query?.tag) {
      where.tags = { has: query.tag };
    }

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { comments: true, postsDetails: true }
      }),
      this.getPostCount(where)
    ]);

    return {
      entities: records.map(record => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculatePostsPage(postCount, take),
      itemsPerPage: take,
      totalItems: postCount
    };
  }

  public async findAfterDate(date: Date) {
    const posts = await this.client.post.findMany({
      where: { dateCreate: { gt: date } },
      include: { comments: true, postsDetails: true }
    });

    return posts.map(post => this.createEntityFromDocument(post).createResponseObject());
  }
}
