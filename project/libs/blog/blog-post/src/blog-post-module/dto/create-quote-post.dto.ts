import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PostQuoteAuthorLength, PostQuoteTextLength } from '../blog-post.constants';

export class CreateQuotePostDto extends CreatePostDto {
  @ApiProperty({
    description: 'Post quote text',
    example: 'Some quote post text'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(PostQuoteTextLength.Min)
  @MaxLength(PostQuoteTextLength.Max)
  public text: string;

  @ApiProperty({
    description: 'Post quote author',
    example: 'Some quote post author'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(PostQuoteAuthorLength.Min)
  @MaxLength(PostQuoteAuthorLength.Max)
  public quoteAuthor: string;
}
