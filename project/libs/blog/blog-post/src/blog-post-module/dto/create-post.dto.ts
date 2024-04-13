import { PostStatus, PostType } from '@prisma/client';

export class CreatePostDto {
  public title: string;
  public type: PostType;
  public status: PostStatus;
  public authorId: string;
  public tags: string[];
}
