import { Post } from "./post.interface";

export interface QuotePost extends Post {
  text: string;
  quoteAuthor: string;
}
