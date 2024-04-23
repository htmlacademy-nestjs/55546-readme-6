import { Module } from '@nestjs/common';

import { BlogPostModule } from '@project/blog-post';
import { BlogCommentModule } from '@project/blog-comment';

@Module({
  imports: [BlogPostModule, BlogCommentModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
