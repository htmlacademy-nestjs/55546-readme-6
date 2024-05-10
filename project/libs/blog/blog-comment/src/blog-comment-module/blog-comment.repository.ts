import { Comment, PaginationResult, SortDirection } from "@project/shared/core";
import { BlogCommentEntity } from "./blog-comment.entity";
import { BasePostgresRepository } from '@project/data-access';
import { BlogCommentFactory } from "./blog-comment.factory";
import { PrismaClientService } from "@project/blog-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogCommentQuery } from "./blog-comment.query";
import { MAX_COMMENTS_COUNT } from "./blog-comment.constants";
import { Prisma } from "@prisma/client";

@Injectable()
export class BlogCommentRepository extends BasePostgresRepository<BlogCommentEntity, Comment> {
  constructor(
    entityFactory: BlogCommentFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: BlogCommentEntity): Promise<void> {
    const record = await this.client.comment.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async findById(id: string): Promise<BlogCommentEntity> {
    const document = await this.client.comment.findFirst({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({
      where: { id }
    });
  }

  // public async findByPostId(postId: string): Promise<BlogCommentEntity[]> {
  //   const records = await this.client.comment.findMany({
  //     where: { postId }
  //   });
  //
  //   return records.map(record => this.createEntityFromDocument(record))
  // }

  public async findByPostId(postId: string, query?: BlogCommentQuery): Promise<PaginationResult<BlogCommentEntity>> {
    const [records, commentsCount] = await Promise.all([
      this.client.comment.findMany({
        where: { postId },
        orderBy: { dateCreate: SortDirection.Desc },
        skip: (query.page - 1) * MAX_COMMENTS_COUNT,
        take: MAX_COMMENTS_COUNT
      }),
      this.client.comment.count({ where: { postId } })
    ]);

    return {
      entities: records.map(record => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: Math.ceil(commentsCount / MAX_COMMENTS_COUNT),
      itemsPerPage: MAX_COMMENTS_COUNT,
      totalItems: commentsCount
    };
  }
}
