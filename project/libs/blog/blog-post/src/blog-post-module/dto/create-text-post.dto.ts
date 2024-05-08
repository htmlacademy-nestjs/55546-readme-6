import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PostAnnounceLength, PostTextLength } from '../blog-post.constants';

export class CreateTextPostDto extends CreatePostDto {
  @ApiProperty({
    description: 'Post announce',
    example: 'Some text post announcement'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(PostAnnounceLength.Max)
  @MinLength(PostAnnounceLength.Min)
  public announcement: string;

  @ApiProperty({
    description: 'Post text',
    example: 'Some post text'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(PostTextLength.Max)
  @MinLength(PostTextLength.Min)
  public text: string;
}
