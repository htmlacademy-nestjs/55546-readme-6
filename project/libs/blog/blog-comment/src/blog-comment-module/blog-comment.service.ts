import { Injectable, NotImplementedException } from "@nestjs/common";
import { BlogCommentRepository } from "./blog-comment.repository";
import { BlogCommentEntity } from "./blog-comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentRepository: BlogCommentRepository
  ) { }

  public getComments(postId: string): Promise<BlogCommentEntity[]> {
    return this.blogCommentRepository.findByPostId(postId);
  }
}
