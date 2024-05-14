import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CommentRdo } from "./comment.rdo";

export class BlogCommentWithPaginationRdo {
  @ApiProperty({
    description: 'List of found comments',
    example: [{
      "id": "44149d99-a160-4b81-83b6-49fe0671b6fb",
      "postId": "7c3328fc-0472-4b70-8029-2e46b725a4d8",
      "authorId": "661022d3615ce5c3c722054f",
      "message": "Test comment text",
      "dateCreate": "2024-04-19T16:45:44.741Z"
    }]
  })
  @Expose()
  @Type(() => CommentRdo)
  public entities: CommentRdo[];

  @ApiProperty({
    description: 'Number of pages for pagination',
    example: 5
  })
  @Expose()
  public totalPages: number;

  @ApiProperty({
    description: 'Total number of records found',
    example: 45
  })
  @Expose()
  public totalItems: number;

  @ApiProperty({
    description: 'Current active page',
    example: 2
  })
  @Expose()
  public currentPage: number;

  @ApiProperty({
    description: 'Maximum number of records per page',
    example: 10
  })
  @Expose()
  public itemsPerPage: number;
}
