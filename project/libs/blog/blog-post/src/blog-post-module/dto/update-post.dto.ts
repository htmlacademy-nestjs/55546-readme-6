import { PostStatus, PostType } from '@prisma/client';

export class UpdatePostDto {
  public title: string;
  public type: PostType;
  public status: PostStatus;
  public authorId: string;
  public tags: string[];
}
