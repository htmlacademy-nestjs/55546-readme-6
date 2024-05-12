import { ApiProperty } from '@nestjs/swagger';
import { CommentRdo } from '@project/blog-comment';
import { Comment, PostStatus, PostType } from '@project/shared/core';
import { Expose, Type } from 'class-transformer';

export class BlogPostRdo {
  @ApiProperty({
    description: 'The uniq post ID',
    example: 'ccaf61d0-0530-4cfc-98fa-4712838d9d96'
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'If the post is a repost, then this id points to the original post',
    example: 'ccaf61d0-0530-4cfc-98fa-4712838d9d96'
  })
  @Expose()
  public originalId: string;

  @ApiProperty({
    description: 'Post title',
    example: 'Guests With A Cheeky Smile'
  })
  @Expose()
  public title: string;

  @ApiProperty({
    description: 'Post types enum',
    enum: PostType,
    example: PostType.Text
  })
  @Expose()
  public type: PostType

  @ApiProperty({
    description: 'Post statuses enum',
    enum: PostStatus,
    example: PostStatus.Published
  })
  @Expose()
  public status: PostStatus;

  @ApiProperty({
    description: 'Post author ID',
    example: '661022d3615ce5c3c722054f'
  })
  @Expose()
  public authorId: string;

  @ApiProperty({
    description: 'If the post is a repost, then this id points to the original post author',
    example: '661022d3615ce5c3c722054f'
  })
  @Expose()
  public originaAuthorlId: string;

  @ApiProperty({
    description: 'Post tags list',
    isArray: true,
    example: ['new', 'tag', 'something']
  })
  @Expose()
  public tags: string[];

  @ApiProperty({
    description: 'Uniq list of user IDs who liked this post',
    isArray: true,
    example: ['661022d3615ce5c3c722054f', '66229f5a637123ebbe48b99b']
  })
  @Expose()
  public likes: string[];

  @ApiProperty({
    description: 'Flag whether the post is reposted',
    example: false
  })
  @Expose()
  public isReposted: boolean;

  @ApiProperty({
    description: 'List of user comments to this post',
    isArray: true,
    example: [{
      "id": "d29938b2-094f-4cef-b639-e734f710d696",
      "postId": "21569a85-6b0e-4f5d-9528-a673f29c0b16",
      "authorId": "66215457a46f67b7a80f4e99",
      "message": "Doll size crop laugh, juicy sock teeny-tiny betty stupendous attack punch, frame separated harmony lying.",
      "dateCreate": "2023-01-14T13:55:21.865Z"
    },
    {
      "id": "aabc0872-674b-4c17-aac1-1856bb070c7a",
      "postId": "21569a85-6b0e-4f5d-9528-a673f29c0b16",
      "authorId": "66215457a46f67b7a80f4e77",
      "message": "Doll size crop laugh, juicy sock teeny-tiny betty stupendous attack punch, frame separated harmony lying.",
      "dateCreate": "2023-10-22T02:36:06.391Z"
    }]
  })
  @Expose()
  @Type(() => CommentRdo)
  public comments: Comment[];

  @ApiProperty({
    description: 'Photo ID for a photo post',
    example: '661022d3615ce5c3c722054f'
  })
  @Expose()
  public photo: string;

  @ApiProperty({
    description: 'Field with information for text and quote posts',
    example: 'Doll size crop laugh, juicy sock teeny-tiny betty stupendous attack punch, frame separated harmony lying.'
  })
  @Expose()
  public text: string;

  @ApiProperty({
    description: 'Field with brief information for a text post',
    example: 'Doll size crop laugh, juicy sock teeny-tiny betty...'
  })
  @Expose()
  public announcement: string;

  @ApiProperty({
    description: 'Quote author for a quote post',
    example: 'Some author name'
  })
  @Expose()
  public quoteAuthor: string;

  @ApiProperty({
    description: 'Link for a link post',
    example: 'https://htmlacademy.ru'
  })
  @Expose()
  public link: string;

  @ApiProperty({
    description: 'Description field for a link post',
    example: 'Online school for web developers'
  })
  @Expose()
  public description: string;

  @ApiProperty({
    description: 'Video field for a video post',
    example: 'https://www.youtube.com/watch?v=0uqhAoMkFUc'
  })
  @Expose()
  public video: string;
}
