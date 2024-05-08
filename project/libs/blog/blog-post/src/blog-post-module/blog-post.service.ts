import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationResult } from '@project/shared/core';
import { BlogPostQuery } from './blog-post.query';
import { BlogCommentFactory, BlogCommentRepository, CreateCommentDto } from '@project/blog-comment';
import { HttpService } from '@nestjs/axios';
import { ApplicationServiceURL } from '@project/api-config';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly blogCommentFactory: BlogCommentFactory,
    private readonly httpService: HttpService,
  ) { }

  public async getPost(id: string): Promise<BlogPostEntity> {
    return this.blogPostRepository.findById(id);
  }

  public async getAllPosts(query?: BlogPostQuery, isOnlyDraft = false): Promise<PaginationResult<BlogPostEntity>> {
    return await this.blogPostRepository.find(query, isOnlyDraft);
  }

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const newPost = new BlogPostEntity(dto as any);
    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async deletePost(postId: string, userId: string): Promise<void> {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (existsPost.authorId !== userId) {
      throw new ForbiddenException(`The user is not the author of this post`);
    }

    try {
      await this.blogPostRepository.deleteById(postId);
    } catch {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }

  public async updatePost(postId: string, userId: string, dto: UpdatePostDto): Promise<BlogPostEntity> {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (existsPost.authorId !== userId) {
      throw new ForbiddenException(`The user is not the author of this post`);
    }

    const blogPostEntity = new BlogPostEntity({ id: postId, ...dto } as any);

    try {
      await this.blogPostRepository.update(blogPostEntity);
      return blogPostEntity;
    } catch {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }

  public async repost(postId: string, userId: string): Promise<BlogPostEntity> {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (existsPost.authorId === userId) {
      throw new ForbiddenException(`You are already the author of this post`);
    }

    const { entities } = await this.getAllPosts({ authorId: userId } as BlogPostQuery);
    for (const entity of entities) {
      if (entity.isReposted && entity.originalId === postId) {
        throw new ForbiddenException(`You are already reposted this post`);
      }
    }

    return await this.blogPostRepository.repost(existsPost, userId);
  }

  async addComment(postId: string, dto: CreateCommentDto) {
    const existsPost = await this.getPost(postId);
    const newComment = this.blogCommentFactory.createFromDto(dto, existsPost.id);
    await this.blogCommentRepository.save(newComment);

    return newComment;
  }
}
