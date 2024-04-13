import { PostType } from "./post.enum";
import { Post } from "./post.interface";

export interface QuotePost extends Post {
  type: PostType.Quote;
  text: string;
  quoteAuthor: string;
}
