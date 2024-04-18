import { IsMongoId, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { BlogCommentValidateMessage, CommentLength } from '../blog-comment.constants';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: BlogCommentValidateMessage.MessageIsEmpty })
  @Min(CommentLength.Min, { message: BlogCommentValidateMessage.MessageLesserMin })
  @Max(CommentLength.Max, { message: BlogCommentValidateMessage.MessageGreaterMax })
  public message: string;

  @IsString()
  @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  public authorId: string;

  @IsString()
  @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  public postId: string;
}
