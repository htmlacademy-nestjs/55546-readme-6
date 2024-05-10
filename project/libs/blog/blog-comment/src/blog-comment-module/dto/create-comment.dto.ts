import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BlogCommentValidateMessage, CommentLength } from '../blog-comment.constants';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text message',
    example: 'Dry share advice obsequious asphalt green danger oven fog deceive.'
  })
  @IsString()
  @IsNotEmpty({ message: BlogCommentValidateMessage.MessageIsEmpty })
  @MinLength(CommentLength.Min, { message: BlogCommentValidateMessage.MessageLesserMin })
  @MaxLength(CommentLength.Max, { message: BlogCommentValidateMessage.MessageGreaterMax })
  public message: string;

  // @ApiProperty({
  //   description: 'ID of the post for which the comment is being created',
  //   example: '86eba68c-b5dc-424a-ae57-361967d0b262'
  // })
  // @IsString()
  // @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  // public postId: string;

  @ApiProperty({
    description: 'Comment author ID',
    example: '661022d3615ce5c3c722054f'
  })
  @IsString()
  @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  public authorId: string;
}

