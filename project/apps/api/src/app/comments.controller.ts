import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApplicationServiceURL } from '@project/api-config';
import { BlogCommentQuery, CreateCommentDto } from '@project/blog-comment';
import { CheckAuthGuard } from '@project/guards';
import { InjectUserIdInterceptor } from '@project/interceptors';

@Controller('posts/:postId/comments')
export class BlogCommentController {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  @Get('/')
  public async show(@Param('postId') postId: string) {
    const { data } = await this.httpService.axiosRef.get(`${ApplicationServiceURL.Blog}/${postId}/comments`);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('/')
  public async createComment(
    @Req() request: Request,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto
  ) {
    try {
      const { data } = await this.httpService.axiosRef
        .post(`${ApplicationServiceURL.Blog}/${postId}/comments`, dto, {
          headers: {
            'Authorization': request.headers['authorization']
          }
        });
      return data;
    } catch (err) {
      return err.response.data;
    }
  }
  @UseGuards(CheckAuthGuard)
  @Delete('/:commentId')
  public async deleteComment(@Req() request: Request, @Param('postId') postId: string, @Param('commentId') commentId: string) {
    const { data } = await this.httpService.axiosRef.delete(`${ApplicationServiceURL.Blog}/${postId}/comments/${commentId}`, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    });

    return data;
  }

  @Get('/find')
  public async getCommentsByPostId(@Param('postId') postId: string, @Query() params: BlogCommentQuery) {
    try {
      const { data } = await this.httpService.axiosRef
        .get(`${ApplicationServiceURL.Blog}/${postId}/comments/find`, { params });
      return data;
    } catch (err) {
      return err.response.data;
    }
  }

  @Get('/:commentId')
  public async getById(@Param('postId') postId: string, @Param('commentId') commentId: string) {
    const { data } = await this.httpService.axiosRef
      .get(`${ApplicationServiceURL.Blog}/${postId}/comments/${commentId}`);
    return data;
  }
}
