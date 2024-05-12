import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApplicationServiceURL } from '@project/api-config';
import { BlogCommentQuery, CreateCommentDto } from '@project/blog-comment';
import { CheckAuthGuard } from '@project/guards';
import { InjectAxiosAuthorization, InjectUserIdInterceptor } from '@project/interceptors';
import { AxiosExceptionFilter } from '@project/filters';

@Controller('posts/:postId/comments')
@UseFilters(AxiosExceptionFilter)
export class BlogCommentController {
  constructor(private readonly httpService: HttpService) { }

  @Get('/')
  public async show(@Param('postId') postId: string) {
    const { data } = await this.httpService.axiosRef.get(`${ApplicationServiceURL.Blog}/${postId}/comments`);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor, InjectAxiosAuthorization)
  @Post('/')
  public async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto
  ) {
    const { data } = await this.httpService.axiosRef
      .post(`${ApplicationServiceURL.Blog}/${postId}/comments`, dto);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectAxiosAuthorization)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:commentId')
  public async deleteComment(@Param('postId') postId: string, @Param('commentId') commentId: string) {
    const { data } = await this.httpService.axiosRef.delete(`${ApplicationServiceURL.Blog}/${postId}/comments/${commentId}`);
    return data;
  }

  @Get('/find')
  public async getCommentsByPostId(@Param('postId') postId: string, @Query() params: BlogCommentQuery) {
    const { data } = await this.httpService.axiosRef
      .get(`${ApplicationServiceURL.Blog}/${postId}/comments/find`, { params });
    return data;
  }

  @Get('/:commentId')
  public async getById(@Param('postId') postId: string, @Param('commentId') commentId: string) {
    const { data } = await this.httpService.axiosRef
      .get(`${ApplicationServiceURL.Blog}/${postId}/comments/${commentId}`);
    return data;
  }
}
