import { PostStatus, PostType } from "./post.enum";

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
