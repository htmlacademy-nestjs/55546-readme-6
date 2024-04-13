import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository
  ) { }

  public async getPost(id: string): Promise<BlogPostEntity> {
    return this.blogPostRepository.findById(id);
  }

  public async getAllPosts(): Promise<BlogPostEntity[]> {
    return await this.blogPostRepository.find();
  }

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const existsPost = (await this.blogPostRepository.find({ title: dto.title })).at(0);
    if (existsPost) {
      throw new ConflictException('A post with the title already exists');
    }

    const newPost = new BlogPostEntity(dto as any);
    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async deletePost(id: string): Promise<void> {
    try {
      await this.blogPostRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  public async updatePost(id: string, dto: UpdatePostDto): Promise<BlogPostEntity> {
    const blogPostEntity = new BlogPostEntity({ id, ...dto } as any);

    try {
      await this.blogPostRepository.update(blogPostEntity);
      return blogPostEntity;
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  public async getPostsByIds(postIds: string[]): Promise<BlogPostEntity[]> {
    const posts = await this.blogPostRepository.findByIds(postIds);

    if (posts.length !== postIds.length) {
      const foundPostIds = posts.map((post) => post.id);
      const notFoundPostIds = postIds.filter((postId) => !foundPostIds.includes(postId));

      if (notFoundPostIds.length > 0) {
        throw new NotFoundException(`Posts with ids ${notFoundPostIds.join(', ')} not found.`);
      }
    }

    return posts;
  }
}
