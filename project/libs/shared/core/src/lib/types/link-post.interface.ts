import { Post } from "./post.interface";

export interface LinkPost extends Post {
  link: string;
  description: string;
}
