import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { YOUTUBE_VALIDATE_LINK_REGEXP } from '../blog-post.constants';

export class CreateVideoPostDto extends CreatePostDto {
  @ApiProperty({
    description: 'Post announce',
    example: 'Some text post announcement'
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @Matches(YOUTUBE_VALIDATE_LINK_REGEXP)
  public link: string;
}
