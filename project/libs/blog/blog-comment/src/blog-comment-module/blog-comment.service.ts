import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { BlogCommentFactory } from "./blog-comment.factory";
import { BlogCommentRepository } from "./blog-comment.repository";
import { BlogCommentQuery } from "./blog-comment.query";
import { BlogCommentResponseMessage } from "./blog-comment.constants";

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentFactory: BlogCommentFactory,
    private readonly blogCommentRepository: BlogCommentRepository,
  ) { }

  getById(commentId: string) {
    return this.blogCommentRepository.findById(commentId);
  }

  async create(postId: string, dto: CreateCommentDto) {
    try {
      const newComment = this.blogCommentFactory.createFromDto(dto, postId);
      await this.blogCommentRepository.save(newComment);

      return newComment;
    } catch (err) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }

  async delete(commentId: string, authorId: string) {
    const existsComment = await this.blogCommentRepository.findById(commentId);
    if (!existsComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (existsComment.authorId !== authorId) {
      throw new ForbiddenException(BlogCommentResponseMessage.UserNotAuthor);
    }

    return await this.blogCommentRepository.deleteById(commentId);
  }

  async getCommentsByPostId(postId: string, query: BlogCommentQuery) {
    return await this.blogCommentRepository.findByPostId(postId, query);
  }
}
