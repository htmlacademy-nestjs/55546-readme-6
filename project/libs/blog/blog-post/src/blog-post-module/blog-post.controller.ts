import { Controller, Get, Param, Post, Body, Delete, Patch, HttpCode, HttpStatus, Query, UseGuards, Req, UsePipes, UseFilters } from '@nestjs/common';

import { fillDto } from '@project/shared/helpers';
import { CheckAuthGuard } from '@project/guards';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostRdo } from './rdo/blog-post.rdo';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
import { RequestWithUser } from '@project/authentication';
import { CreateCommentDto } from '@project/blog-comment';
import { CommentRdo } from '@project/blog-comment';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MAX_SEARCH_COUNT, PostResponseMessage } from './blog-post.constants';
import { PostValidationPipe } from './pipes/post-validation.pipe';

@ApiTags('posts')
@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @Get('/')
  public async index(@Query() query: BlogPostQuery) {
    const postWithPagination = await this.blogPostService.getAllPosts(query);
    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) =>
        ({ ...blogPost.toPOJO(), ...blogPost.detailsToObject() }))
    };

    return result;

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @Get('/search')
  public async search(@Query('title') title: string) {
    const postWithPagination = await this.blogPostService
      .getAllPosts({ title, limit: MAX_SEARCH_COUNT } as BlogPostQuery);

    return postWithPagination.entities.map((blogPost) =>
      ({ ...blogPost.toPOJO(), ...blogPost.detailsToObject() }));

    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) =>
        ({ ...blogPost.toPOJO(), ...blogPost.detailsToObject() }))
    };

    return result;

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @Get('/user/:userId')
  public async getUserPosts(@Param('userId') authorId: string) {
    const postWithPagination = await this.blogPostService.getAllPosts({ authorId } as BlogPostQuery);
    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) =>
        ({ ...blogPost.toPOJO(), ...blogPost.detailsToObject() }))
    };

    return result;

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @UseGuards(CheckAuthGuard)
  @Get('/draft')
  public async getUserDraftPosts(@Req() { user }: RequestWithUser) {
    const postWithPagination = await this.blogPostService
      .getAllPosts({ authorId: user.id } as BlogPostQuery, true);

    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) =>
        ({ ...blogPost.toPOJO(), ...blogPost.detailsToObject() }))
    };

    return result;

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.CREATED,
    description: PostResponseMessage.PostCreated
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PostResponseMessage.PostValidationError
  })
  @UseGuards(CheckAuthGuard)
  @UsePipes(PostValidationPipe)
  // @UseFilters(ValidationExceptionFilter)
  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);

    return { ...newPost.toPOJO(), ...newPost.detailsToObject() };
    return fillDto(BlogPostRdo, newPost.toPOJO() as any);
  }

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.PostFound
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.PostNotFound
  })
  @Get('/:id')
  public async show(@Param('id') id: string) {
    const postEntity = await this.blogPostService.getPost(id);

    return postEntity.createResponseObject();
    // return fillDto(BlogPostRdo, postEntity.toPOJO() as any);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: PostResponseMessage.PostDeleted
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.PostNotFound
  })
  @UseGuards(CheckAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Req() { user }: RequestWithUser, @Param('id') id: string) {
    await this.blogPostService.deletePost(id, user.id);
  }

  @ApiResponse({
    type: BlogPostRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.PostUpdated
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.PostNotFound
  })
  @UseGuards(CheckAuthGuard)
  @Patch('/:id')
  public async update(@Req() { user }: RequestWithUser, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, user.id, dto);

    return { ...updatedPost.toPOJO(), ...updatedPost.detailsToObject() };
    return fillDto(BlogPostRdo, updatedPost.toPOJO() as any);
  }

  @UseGuards(CheckAuthGuard)
  @Post('/repost/:postId')
  public async repost(
    @Req() request: Request & RequestWithUser, @Param('postId') postId: string
  ) {
    const repostedPost = await this.blogPostService.repost(postId, request.user.id);

    return { ...repostedPost.toPOJO(), ...repostedPost.detailsToObject() }

    // return fillDto(CommentRdo, newComment.toPOJO() as any)
  }

  @ApiResponse({
    type: CommentRdo,
    status: HttpStatus.CREATED,
    description: PostResponseMessage.CommentCreated
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PostResponseMessage.CommentValidationError
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.PostNotFound
  })
  @UseGuards(CheckAuthGuard)
  @Post('/:postId/comments')
  public async createComment(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const newComment = await this.blogPostService.addComment(postId, dto);

    return fillDto(CommentRdo, newComment.toPOJO() as any)
  }

  // @UseGuards(CheckAuthGuard)
  // @Post('/get-users-posts')
  // public async getUsersPosts(@Req() { user }: RequestWithUser) {
  //   const newComment = await this.blogPostService.addComment(postId, dto);
  //
  //   return fillDto(CommentRdo, newComment.toPOJO() as any)
  // }
}
