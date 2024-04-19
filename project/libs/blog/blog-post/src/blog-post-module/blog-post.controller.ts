import { Controller, Get, Param, Post, Body, Delete, Patch, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { fillDto } from '@project/shared/helpers';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostRdo } from './rdo/blog-post.rdo';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';

@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @Get('/')
  public async index(@Query() query: BlogPostQuery) {
    const postWithPagination = await this.blogPostService.getAllPosts(query);
    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) => blogPost.toPOJO())
    };

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO() as any);
  }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const postEntity = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, postEntity.toPOJO() as any);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(BlogPostRdo, updatedPost.toPOJO() as any);
  }
}
