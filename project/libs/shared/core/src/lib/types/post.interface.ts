import { PostStatus, PostType } from "./post.enum";

export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  author: string;
  title: string;
  tags?: string[];
  dateCreate: Date;
  dateUpdate: Date;
  isReposted: boolean;
}
