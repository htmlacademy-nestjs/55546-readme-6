import { IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BlogCommentValidateMessage, CommentLength } from '../blog-comment.constants';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: BlogCommentValidateMessage.MessageIsEmpty })
  @MinLength(CommentLength.Min, { message: BlogCommentValidateMessage.MessageLesserMin })
  @MaxLength(CommentLength.Max, { message: BlogCommentValidateMessage.MessageGreaterMax })
  public message: string;

  @IsString()
  @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  public authorId: string;
}
