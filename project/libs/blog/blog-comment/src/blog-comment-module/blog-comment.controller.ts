import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { CommentRdo } from './rdo/comment.rdo';
import { fillDto } from '@project/shared/helpers';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckAuthGuard } from '@project/guards';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RequestWithUser } from '@project/authentication';
import { BlogCommentQuery } from './blog-comment.query';
import { BlogCommentResponseMessage, ParamDescription } from './blog-comment.constants';
import { BlogCommentWithPaginationRdo } from './rdo/blog-comment-with-pagination.rdo';
import { AxiosExceptionFilter } from '@project/filters';
import { InjectUserIdInterceptor } from '@project/interceptors';

@ApiTags('comments')
@Controller('posts/:postId/comments')
@UseFilters(AxiosExceptionFilter)
export class BlogCommentController {
  constructor(
    private readonly blogCommentService: BlogCommentService,
  ) { }

  @ApiResponse({
    type: CommentRdo,
    status: HttpStatus.CREATED,
    description: BlogCommentResponseMessage.CommentCreated
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: BlogCommentResponseMessage.CommentValidationError
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponseMessage.PostNotFound
  })
  @ApiParam({ name: "postId", required: true, description: ParamDescription.PostId })
  @ApiBody({ type: CreateCommentDto })
  @UseInterceptors(InjectUserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  @Post('/')
  public async createComment(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const newComment = await this.blogCommentService.create(postId, dto);

    return fillDto(CommentRdo, { ...newComment.toPOJO() })
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogCommentResponseMessage.CommentDeleted
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponseMessage.CommentNotFound
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogCommentResponseMessage.JwtAuthError
  })
  @ApiParam({ name: "commentId", required: true, description: ParamDescription.CommentId })
  @UseGuards(CheckAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:commentId')
  public async deleteComment(@Req() { user }: RequestWithUser, @Param('commentId') commentId: string) {
    return this.blogCommentService.delete(commentId, user.id);
  }

  @ApiResponse({
    type: BlogCommentWithPaginationRdo,
    status: HttpStatus.OK,
    description: BlogCommentResponseMessage.FoundCommentList
  })
  @ApiQuery({ type: BlogCommentQuery })
  @ApiParam({ name: "postId", required: true, description: ParamDescription.PostId })
  @Get('/find')
  public async getCommentsByPostId(@Param('postId') postId: string, @Query() query: BlogCommentQuery) {
    const data = await this.blogCommentService.getCommentsByPostId(postId, query);

    return {
      ...data,
      entities: data.entities.map(comment => fillDto(CommentRdo, { ...comment.toPOJO() }))
    };
  }

  @ApiResponse({
    type: CommentRdo,
    status: HttpStatus.OK,
    description: BlogCommentResponseMessage.CommentFound
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentResponseMessage.CommentNotFound
  })
  @ApiParam({ name: "commentId", required: true, description: ParamDescription.CommentId })
  @Get('/:commentId')
  public async getById(@Param('commentId') commentId: string) {
    const comment = await this.blogCommentService.getById(commentId);

    return fillDto(CommentRdo, { ...comment.toPOJO() });
  }
}
