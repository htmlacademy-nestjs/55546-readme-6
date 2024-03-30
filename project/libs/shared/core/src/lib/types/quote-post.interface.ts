import { PostType } from "./post.enum";
import { Post } from "./post.interface";

export interface QuotePost extends Omit<Post, 'title'> {
  type: PostType.Quote;
  text: string;
  quoteAuthor: string;
}
