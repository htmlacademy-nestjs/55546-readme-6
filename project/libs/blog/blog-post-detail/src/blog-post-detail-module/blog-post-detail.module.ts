import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/blog-models';
import { BlogPostDetailRepository } from './blog-post-detail.repository';
import { BlogPostDetailFactory } from './blog-post-detail.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [BlogPostDetailRepository, BlogPostDetailFactory]
})
export class BlogPostDetailModule { }
