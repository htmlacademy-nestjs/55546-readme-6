import { PostType } from "./post.enum";
import { Post } from "./post.interface";

export interface TextPost extends Post {
  type: PostType.Text;
  announcement: string;
  text: string;
}
