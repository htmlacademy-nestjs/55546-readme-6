import { PostStatus, PostType } from '@prisma/client';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public title?: string;

  @IsOptional()
  @IsEnum(PostType)
  @IsNotEmpty()
  public type?: PostType;

  @IsOptional()
  @IsEnum(PostStatus)
  @IsNotEmpty()
  public status?: PostStatus;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  public authorId: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  public tags?: string[];
}
