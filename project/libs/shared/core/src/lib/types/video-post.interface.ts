import { PostType } from "./post.enum";
import { Post } from "./post.interface";

export interface VideoPost extends Post {
  type: PostType.Video;
  link: string;
}
