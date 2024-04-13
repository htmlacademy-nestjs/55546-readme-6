import { Controller, Get, Param, Post, Body, Delete, Patch, HttpCode, HttpStatus } from '@nestjs/common';

import { fillDto } from '@project/shared/helpers';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRdo } from './rdo/post.rdo';

@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const postEntity = await this.blogPostService.getPost(id);
    return fillDto(PostRdo, postEntity.toPOJO() as any);
  }

  @Get('/')
  public async index() {
    const blogPostEntities = await this.blogPostService.getAllPosts();
    const posts = blogPostEntities.map((blogPost) => blogPost.toPOJO());
    return fillDto(PostRdo, posts as any);
  }

  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(PostRdo, newPost.toPOJO() as any);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO() as any);
  }
}
