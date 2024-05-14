import { Post } from "./post.interface";

export interface TextPost extends Post {
  announcement: string;
  text: string;
}
