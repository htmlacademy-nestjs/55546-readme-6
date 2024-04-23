import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentRdo {
  @ApiProperty({
    description: 'Post ID of this comment',
    example: 'ccaf61d0-0530-4cfc-98fa-4712838d9d96'
  })
  @Expose()
  public postId: string;

  @ApiProperty({
    description: 'Comment text message',
    example: 'Dry share advice obsequious asphalt green danger oven fog deceive.'
  })
  @Expose()
  public message: string;

  @ApiProperty({
    description: 'Comment author ID',
    example: '661022d3615ce5c3c722054f'
  })
  @Expose()
  public userId: string;

  @ApiProperty({
    description: 'Date the comment was created',
    example: new Date()
  })
  @Expose()
  public createdAt: Date;
}
