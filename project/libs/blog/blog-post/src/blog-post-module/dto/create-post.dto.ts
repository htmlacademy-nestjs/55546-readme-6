import { PostStatus, PostType } from '@prisma/client';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  public type: PostType;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  public status: PostStatus;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  public authorId: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  public tags?: string[];
}
