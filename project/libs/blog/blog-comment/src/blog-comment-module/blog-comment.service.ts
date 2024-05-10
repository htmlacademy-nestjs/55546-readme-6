import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
// import { BlogCommentRepository } from "./blog-comment.repository";
import { BlogCommentEntity } from "./blog-comment.entity";
import { PaginationResult } from "@project/shared/core";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { BlogCommentFactory } from "./blog-comment.factory";
import { BlogCommentRepository } from "./blog-comment.repository";
import { BlogCommentQuery } from "./blog-comment.query";

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentFactory: BlogCommentFactory,
    private readonly blogCommentRepository: BlogCommentRepository,
  ) { }

  public getComments(postId: string): Promise<PaginationResult<BlogCommentEntity>> {
    return {} as any;
    // return this.blogCommentRepository.findByPostId(postId);
  }

  getById(commentId: string) {
    return this.blogCommentRepository.findById(commentId);
  }

  async create(postId: string, dto: CreateCommentDto) {
    // const existsPost = await this.blogPostService.getPost(postId);
    // if (!existsPost) {
    //   throw new NotFoundException(`Post with ID ${postId} not found`);
    // }

    const newComment = this.blogCommentFactory.createFromDto(dto, postId);
    await this.blogCommentRepository.save(newComment);

    return newComment;
  }

  async delete(commentId: string, authorId: string) {
    const existsComment = await this.blogCommentRepository.findById(commentId);
    if (!existsComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (existsComment.authorId !== authorId) {
      throw new ForbiddenException(`The user is not the author of this comment`);
    }

    return await this.blogCommentRepository.deleteById(commentId);
  }

  async getCommentsByPostId(postId: string, query: BlogCommentQuery) {
    //   const existsPost = await this.getPost(postId);
    //   if (!existsPost) {
    //     throw new NotFoundException(`Post with ID ${postId} not found`);
    //   }

    return await this.blogCommentRepository.findByPostId(postId, query);
  }
}
