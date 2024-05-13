import { Controller, UseFilters, Get, Param, Post, Body, Delete, Patch, HttpCode, HttpStatus, Query, UseGuards, Req, UsePipes, UseInterceptors } from '@nestjs/common';
import { fillDto } from '@project/shared/helpers';
import { CheckAuthGuard } from '@project/guards';
import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostRdo } from './rdo/blog-post.rdo';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
import { RequestWithUser } from '@project/authentication';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MAX_SEARCH_COUNT, ParamDescription, PostResponseMessage, QueryDescription } from './blog-post.constants';
import { PostValidationPipe } from './pipes/post-validation.pipe';
import { AxiosExceptionFilter } from '@project/filters';
import { InjectUserIdInterceptor } from '@project/interceptors';

@ApiTags('posts')
@Controller('posts')
@UseFilters(AxiosExceptionFilter)
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) { }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @ApiQuery({ type: BlogPostQuery, description: QueryDescription.PaginationList })
  @Get('/')
  public async index(@Query() query: BlogPostQuery) {
    const postWithPagination = await this.blogPostService.getAllPosts(query);
    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map(post => post.createResponseObject())
    };

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.UserNotFound
  })
  @UseGuards(CheckAuthGuard)
  @ApiQuery({ type: BlogPostQuery, description: QueryDescription.PaginationList })
  @Post('/content-ribbon')
  public async contentRibbon(@Body() usersIds: string[], @Query() query: BlogPostQuery) {
    const postWithPagination = await this.blogPostService
      .getAllPosts(query, false, usersIds);

    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map(post => post.createResponseObject())
    };

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @ApiResponse({
    type: [BlogPostRdo],
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: PostResponseMessage.JwtAuthError
  })
  @ApiQuery({ type: 'date', description: QueryDescription.LastDate })
  @UseGuards(CheckAuthGuard)
  @Get('/find-after-date')
  public async findAfterDate(@Query('date') date: Date) {
    const posts = await this.blogPostService.findAfterDate(date);

    return posts.map(post => fillDto(BlogPostRdo, post.createResponseObject()));
  }

  @ApiResponse({
    type: [BlogPostRdo],
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @ApiQuery({ type: 'string', description: QueryDescription.SearchedTitle })
  @Get('/search')
  public async search(@Query('title') title: string) {
    const postWithPagination = await this.blogPostService
      .getAllPosts({ title, limit: MAX_SEARCH_COUNT } as BlogPostQuery);

    return postWithPagination.entities.map((blogPost) =>
      fillDto(BlogPostRdo, blogPost.createResponseObject()));
  }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.UserNotFound
  })
  @ApiParam({ name: "userId", required: true, description: ParamDescription.UserId })
  @Get('/user/:userId')
  public async getUserPosts(@Param('userId') authorId: string) {
    const postWithPagination = await this.blogPostService.getAllPosts({ authorId } as BlogPostQuery);
    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) => blogPost.createResponseObject())
    };

    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @ApiResponse({
    type: BlogPostWithPaginationRdo,
    status: HttpStatus.OK,
    description: PostResponseMessage.FoundPostList
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: PostResponseMessage.JwtAuthError
  })
  @UseGuards(CheckAuthGuard)
  @Get('/draft')
  public async getUserDraftPosts(@Req() { user }: RequestWithUser) {
    const postWithPagination = await this.blogPostService
      .getAllPosts({ authorId: user.id } as BlogPostQuery, true);

    const result = {
      ...postWithPagination,
      entities: postWithPagination.entities.map((blogPost) => blogPost.createResponseObject())
    };

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
  @ApiBody({ type: CreatePostDto })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @UsePipes(PostValidationPipe)
  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);

    return fillDto(BlogPostRdo, newPost.createResponseObject());
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
  @ApiParam({ name: "id", required: true, description: ParamDescription.PostId })
  @ApiBody({ type: UpdatePostDto })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @UsePipes(PostValidationPipe)
  @Patch('/:id')
  public async update(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto
  ) {
    const updatedPost = await this.blogPostService.updatePost(id, user.id, dto);

    return fillDto(BlogPostRdo, updatedPost.createResponseObject());
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
  @ApiParam({ name: "id", required: true, description: ParamDescription.PostId })
  @Get('/:id')
  public async show(@Param('id') id: string) {
    const postEntity = await this.blogPostService.getPost(id);

    return fillDto(BlogPostRdo, postEntity.createResponseObject());
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: PostResponseMessage.PostDeleted
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostResponseMessage.PostNotFound
  })
  @ApiParam({ name: "id", required: true, description: ParamDescription.PostId })
  @UseGuards(CheckAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Req() { user }: RequestWithUser, @Param('id') id: string) {
    await this.blogPostService.deletePost(id, user.id);
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: PostResponseMessage.JwtAuthError
  })
  @ApiParam({ name: "postId", required: true, description: ParamDescription.PostId })
  @UseGuards(CheckAuthGuard)
  @Post('/repost/:postId')
  public async repost(
    @Req() request: Request & RequestWithUser,
    @Param('postId') postId: string
  ) {
    const repostedPost = await this.blogPostService.repost(postId, request.user.id);

    return fillDto(BlogPostRdo, repostedPost.createResponseObject());
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: PostResponseMessage.JwtAuthError
  })
  @ApiParam({ name: "postId", required: true, description: ParamDescription.PostId })
  @UseGuards(CheckAuthGuard)
  @Patch('/like/:postId')
  public async like(
    @Req() request: Request & RequestWithUser,
    @Param('postId') postId: string
  ) {
    const post = await this.blogPostService.like(postId, request.user.id);

    return fillDto(BlogPostRdo, post.createResponseObject());
  }
}
