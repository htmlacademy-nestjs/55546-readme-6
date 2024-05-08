import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { ApplicationServiceURL } from '@project/api-config';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { CheckAuthGuard } from '@project/guards';
import { BlogPostQuery, UpdatePostDto } from '@project/blog-post';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from '@project/shared/helpers';
import { RequestWithUser } from '@project/authentication';
import 'express';
import { CommonPostType } from '@project/shared/core';

@Controller('posts')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  private async getPostsWithUsersData(posts: CommonPostType[]) {
    const usersListId = [
      ...new Set(posts.map(({ authorId }) => authorId))
    ];

    const { data: users } = await this.httpService
      .axiosRef.post(`${ApplicationServiceURL.Users}/get-users-by-id`, { usersListId });

    return posts.map(post => {
      return { ...post, user: users.find(user => user.id === post.authorId) };
    })
  }

  @Get('/')
  public async index(@Query() params: BlogPostQuery) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}`, { params });

    return {
      ...data,
      entities: this.getPostsWithUsersData(data.entities)
    };

  }

  @Get('/search')
  public async search(@Query('title') title: string) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/search`, { params: { title } });

    return data;
  }

  @Get('/user/:userId')
  public async getUserPosts(@Param('userId') authorId: string) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/user/${authorId}`);

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Get('/draft')
  public async getUserDraftPosts(@Req() request: Request) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/draft`, {
        headers: {
          'Authorization': request.headers['authorization']
        }
      });

    return data;
  }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/${id}`);

    if (data.photo) {
      const { data: { subDirectory, hashName } } = await this.httpService
        .axiosRef.get(`${ApplicationServiceURL.FilesStorage}/${data.photo}`);

      return { ...data, photo: `/static/${subDirectory}/${hashName}` }
    }

    return data;
  }

  @UseGuards(CheckAuthGuard)
  // @UsePipes(PostValidationPipe)
  @UseInterceptors(FileInterceptor('photo'))
  // @UseFilters(ValidationExceptionFilter)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('/')
  public async create(
    @Req() request: Request & RequestWithUser,
    @Body() dto: any,
    @UploadedFile(
      (new ParseFilePipeBuilder())
        .addMaxSizeValidator({ maxSize: 1000000 })
        .addFileTypeValidator({ fileType: /(jpe?g|png)/ })
        .build({ fileIsRequired: false })
    ) photo?: Express.Multer.File
  ) {
    const photoId = photo ? (await saveFile(this.httpService, photo)).id : undefined;

    dto.authorId = request.user.id;
    dto = dto.type === 'Photo' ? { ...dto, photoId } : dto;

    try {
      const { data } = await this.httpService
        .axiosRef.post(`${ApplicationServiceURL.Blog}/`, dto, {
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
  @Post('/repost/:postId')
  public async repost(
    @Req() request: Request,
    @Param('postId') postId: string
  ) {
    try {
      const { data } = await this.httpService
        .axiosRef.post(`${ApplicationServiceURL.Blog}/repost/${postId}`, {}, {
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
  @UseInterceptors(InjectUserIdInterceptor)
  @Patch('/:id')
  public async update(@Req() request: Request, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    try {
      const { data } = await this.httpService
        .axiosRef.patch(`${ApplicationServiceURL.Blog}/${id}`, dto, {
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
  @UseInterceptors(InjectUserIdInterceptor)
  @Delete('/:id')
  public async delete(@Req() request: Request, @Param('id') id: string) {
    await this.httpService.axiosRef.delete(`${ApplicationServiceURL.Blog}/${id}`, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    });
  }
}
