import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';

import { BlogCommentService } from './blog-comment.service';
import { CommentRdo } from './rdo/comment.rdo';
import { fillDto } from '@project/shared/helpers';
import { ApiResponse } from '@nestjs/swagger';
import { CheckAuthGuard } from '@project/guards';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RequestWithUser } from '@project/authentication';
import { BlogCommentQuery } from './blog-comment.query';

@Controller('posts/:postId/comments')
export class BlogCommentController {
  constructor(
    private readonly blogCommentService: BlogCommentService,
  ) { }

  @Get('/')
  public async show(@Param('postId') postId: string) {
    const comments = await this.blogCommentService.getComments(postId);

    return comments;
    // return fillDto(CommentRdo, comments.map((comment) => comment.toPOJO()) as any);
  }

  @ApiResponse({
    type: CommentRdo,
    status: HttpStatus.CREATED,
    // description: PostResponseMessage.CommentCreated
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    // description: PostResponseMessage.CommentValidationError
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    // description: PostResponseMessage.PostNotFound
  })
  @UseGuards(CheckAuthGuard)
  @Post('/')
  public async createComment(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const newComment = await this.blogCommentService.create(postId, dto);

    return fillDto(CommentRdo, { ...newComment.toPOJO() })
  }

  @UseGuards(CheckAuthGuard)
  @Delete('/:commentId')
  public async deleteComment(@Req() { user }: RequestWithUser, @Param('commentId') commentId: string) {
    return this.blogCommentService.delete(commentId, user.id);
  }

  @Get('/find')
  public async getCommentsByPostId(@Param('postId') postId: string, @Query() query: BlogCommentQuery) {
    return this.blogCommentService.getCommentsByPostId(postId, query);
  }

  @Get('/:commentId')
  public async getById(@Param('commentId') commentId: string) {
    return this.blogCommentService.getById(commentId);
  }
}
