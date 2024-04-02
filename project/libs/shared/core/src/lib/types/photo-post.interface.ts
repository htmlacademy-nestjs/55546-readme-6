import { PostType } from "./post.enum";
import { Post } from "./post.interface";

export interface PhotoPost extends Omit<Post, 'title'> {
  type: PostType.Photo;
  photo: string;
}
