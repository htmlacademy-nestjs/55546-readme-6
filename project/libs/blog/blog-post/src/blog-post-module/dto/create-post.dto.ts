import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '@prisma/client';
import { ArrayMaxSize, IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { MAX_POST_TAGS, TAG_VALIDATE_REGEXP } from '../blog-post.constants';

export class CreatePostDto {
  @ApiProperty({
    description: 'Guests With A Cheeky Smile',
    example: 'Some post title'
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    description: 'Post types enum',
    enum: PostType,
    example: PostType.Text
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  public type: PostType;

  @ApiProperty({
    description: 'Post statuses enum',
    enum: PostStatus,
    example: PostStatus.Published
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  public status: PostStatus;

  @ApiProperty({
    description: 'Post author ID',
    example: '661022d3615ce5c3c722054f'
  })
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  public authorId: string;

  @ApiProperty({
    description: 'Post tags list',
    isArray: true,
    example: ['new', 'tag', 'something']
  })
  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_POST_TAGS)
  @Matches(TAG_VALIDATE_REGEXP, { each: true })
  @IsArray()
  public tags?: string[];
}
