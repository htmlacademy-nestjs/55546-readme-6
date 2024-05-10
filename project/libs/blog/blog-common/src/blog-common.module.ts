import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/blog-models';
import { BlogPostModule } from '@project/blog-post';
import { BlogCommentModule } from '@project/blog-comment';
import { BlogPostDetailModule } from '@project/blog-post-detail';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@project/api-config';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    HttpModule.register({
      timeout: HttpClient.Timeout,
      maxRedirects: HttpClient.MaxRedirects,
    }),
    PrismaClientModule,
    BlogCommentModule,
    BlogPostModule,
    BlogPostDetailModule
  ],
})
export class BlogCommonModule { }
