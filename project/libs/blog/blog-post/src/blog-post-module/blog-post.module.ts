import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/blog-models';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostController } from './blog-post.controller';
import { BlogCommentModule } from '@project/blog-comment';
import { BlogPostDetailModule } from '@project/blog-post-detail';
import { CheckAuthGuard } from '@project/guards';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@project/api-config';

@Module({
  imports: [
    HttpModule.register({
      timeout: HttpClient.Timeout,
      maxRedirects: HttpClient.MaxRedirects,
    }),
    PrismaClientModule,
    BlogCommentModule,
    BlogPostDetailModule
  ],
  providers: [BlogPostRepository, BlogPostService, BlogPostFactory, CheckAuthGuard],
  controllers: [BlogPostController],
  exports: [BlogPostService]
})
export class BlogPostModule { }
