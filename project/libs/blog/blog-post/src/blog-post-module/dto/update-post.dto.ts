import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '@project/shared/core';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Guests With A Cheeky Smile',
    example: 'Some post title'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public title?: string;

  @ApiProperty({
    description: 'Post types enum',
    enum: PostType,
    example: PostType.Text
  })
  @IsOptional()
  @IsEnum(PostType)
  @IsNotEmpty()
  public type?: PostType;

  @ApiProperty({
    description: 'Post statuses enum',
    enum: PostStatus,
    example: PostStatus.Published
  })
  @IsOptional()
  @IsEnum(PostStatus)
  @IsNotEmpty()
  public status?: PostStatus;

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
  @IsArray()
  public tags?: string[];
}

