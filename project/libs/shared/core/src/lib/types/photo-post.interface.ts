import { PostType } from "./post.enum";
import { Post } from "./post.interface";

export interface PhotoPost extends Post {
  type: PostType.Photo;
  photo: string;
}
