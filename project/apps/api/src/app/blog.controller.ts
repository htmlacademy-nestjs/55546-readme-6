import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Query, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from '@project/filters';
import { ApplicationServiceURL } from '@project/api-config';
import { InjectAxiosAuthorization, InjectUserIdInterceptor } from '@project/interceptors';
import { CheckAuthGuard } from '@project/guards';
import { BlogPostQuery } from '@project/blog-post';
import { FileInterceptor } from '@nestjs/platform-express';
import 'express';
import { BlogService } from './services/blog.service';
import { AVAILABLE_POST_PHOTO_TYPE, MAX_POST_PHOTO_SIZE } from '@project/blog-post';
import { RequestWithUser } from '@project/authentication';

@Controller('posts')
@UseInterceptors(InjectAxiosAuthorization)
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly httpService: HttpService
  ) { }

  @Get('/')
  public async index(@Query() params: BlogPostQuery) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}`, { params });

    return {
      ...data,
      entities: await this.blogService.getPostsWithAdditionalData(data.entities)
    };
  }

  @UseGuards(CheckAuthGuard)
  @Get('/content-ribbon')
  public async contentRibbon(
    @Req() { user }: RequestWithUser,
    @Query() query: BlogPostQuery
  ) {
    return this.blogService.getContentRibbon(user.id, query);
  }

  @Get('/search')
  public async search(@Query('title') title: string) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/search`, { params: { title } });

    return this.blogService.getPostsWithAdditionalData(data);
  }

  @Get('/user/:userId')
  public async getUserPosts(@Param('userId') authorId: string) {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/user/${authorId}`);

    return {
      ...data,
      entities: await this.blogService.getPostsWithAdditionalData(data.entities)
    };
  }

  @UseGuards(CheckAuthGuard)
  @Get('/draft')
  public async getUserDraftPosts() {
    const { data } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/draft`);

    return {
      ...data,
      entities: await this.blogService.getPostsWithAdditionalData(data.entities)
    };
  }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.blogService.show(id);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('photo'), InjectUserIdInterceptor)
  @Post('/')
  public async create(
    @Body() dto: any,
    @UploadedFile(
      (new ParseFilePipeBuilder())
        .addMaxSizeValidator({ maxSize: MAX_POST_PHOTO_SIZE })
        .addFileTypeValidator({ fileType: AVAILABLE_POST_PHOTO_TYPE })
        .build({ fileIsRequired: false })
    ) photo?: Express.Multer.File
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      await this.blogService.savePostFile(dto, photo)
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('photo'), InjectUserIdInterceptor)
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile(
      (new ParseFilePipeBuilder())
        .addMaxSizeValidator({ maxSize: MAX_POST_PHOTO_SIZE })
        .addFileTypeValidator({ fileType: AVAILABLE_POST_PHOTO_TYPE })
        .build({ fileIsRequired: false })
    ) photo?: Express.Multer.File
  ) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Blog}/${id}`,
      await this.blogService.savePostFile(dto, photo)
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('/repost/:postId')
  public async repost(@Param('postId') postId: string) {
    const { data } = await this.httpService
      .axiosRef.post(`${ApplicationServiceURL.Blog}/repost/${postId}`);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Patch('/like/:postId')
  public async like(@Param('postId') postId: string) {
    const { data } = await this.httpService
      .axiosRef.patch(`${ApplicationServiceURL.Blog}/like/${postId}`);

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    await this.httpService.axiosRef.delete(`${ApplicationServiceURL.Blog}/${id}`);
  }
}
