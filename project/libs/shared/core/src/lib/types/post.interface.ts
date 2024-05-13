import { Comment } from "./comment.interface";
import { LinkPost } from "./link-post.interface";
import { PhotoPost } from "./photo-post.interface";
import { QuotePost } from "./quote-post.interface";
import { TextPost } from "./text-post.interface";
import { VideoPost } from "./video-post.interface";
import { PostDetailType, PostType, PostStatus } from '@prisma/client';

export interface PostDetailItem {
  id: string;
  postId: string;
  type: PostDetailType;
  value: string;
}

export interface Post {
  id: string;
  originalId: string;
  type: PostType;
  status: PostStatus;
  authorId: string;
  originalAuthorId: string;
  title: string;
  tags?: string[];
  likes?: string[];
  dateCreate: Date;
  dateUpdate: Date;
  isReposted: boolean;
  comments?: Comment[];
  postsDetails?: any[];
}

export type CommonPostType = PhotoPost | TextPost | VideoPost | QuotePost | LinkPost;
