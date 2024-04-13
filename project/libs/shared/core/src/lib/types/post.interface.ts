import { LinkPost } from "./link-post.interface";
import { PhotoPost } from "./photo-post.interface";
import { PostStatus, PostType } from "./post.enum";
import { QuotePost } from "./quote-post.interface";
import { TextPost } from "./text-post.interface";
import { VideoPost } from "./video-post.interface";

export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  authorId: string;
  title: string;
  tags?: string[];
  likes?: string[];
  dateCreate: Date;
  dateUpdate: Date;
  isReposted: boolean;
}

export type CommonPostType = PhotoPost | TextPost | VideoPost | QuotePost | LinkPost;
