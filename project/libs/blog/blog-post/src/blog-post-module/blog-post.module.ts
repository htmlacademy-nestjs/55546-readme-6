import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/blog-models';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostController } from './blog-post.controller';
import { BlogCommentModule } from '@project/blog-comment';

@Module({
  imports: [PrismaClientModule, BlogCommentModule],
  providers: [BlogPostRepository, BlogPostService, BlogPostFactory],
  controllers: [BlogPostController],
  exports: [BlogPostService]
})
export class BlogPostModule { }
