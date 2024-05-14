import { CommonPostType, Entity } from '@project/shared/core';
import { StorableEntity } from '@project/shared/core';
import { BlogCommentEntity, BlogCommentFactory } from '@project/blog-comment';
import { BlogPostDetailEntity, BlogPostDetailFactory } from '@project/blog-post-detail';
import { PostDetailType, PostType, PostStatus } from '@prisma/client';

export class BlogPostEntity extends Entity implements StorableEntity<CommonPostType> {
  public originalId: string;
  public type: PostType;
  public status: PostStatus;
  public authorId: string;
  public originalAuthorId: string;
  public title: string;
  public tags?: string[];
  public likes?: string[];
  public likesCount?: number;
  public dateCreate?: Date;
  public dateUpdate?: Date;
  public isReposted: boolean;
  public comments: BlogCommentEntity[];
  public postsDetails: BlogPostDetailEntity[] = [];

  constructor(post?: CommonPostType) {
    super();
    this.populate(post);
  }

  public populate(post?: CommonPostType) {
    if (!post) {
      return;
    }

    this.id = post.id ?? undefined;
    this.originalId = post.originalId ?? undefined;
    this.title = post.title ?? undefined;
    this.type = post.type ?? undefined;
    this.status = post.status ?? PostStatus.Draft;
    this.authorId = post.authorId ?? undefined;
    this.originalAuthorId = post.originalAuthorId ?? undefined;
    this.tags = post.tags ?? [];
    this.likes = post.likes ?? [];
    this.isReposted = post.isReposted ?? false;
    this.dateCreate = post.dateCreate;
    this.dateUpdate = post.dateUpdate;

    const blogCommentFactory = new BlogCommentFactory();
    this.comments = post.comments?.map(comment => blogCommentFactory.create(comment)) ?? [];

    this.fillDetails(post);
  }

  fillDetails(post: any) {
    if (post.type === PostType.Photo) {
      this.addDetail({ type: PostDetailType.Photo, value: post.photoId });
    }

    if (post.type === PostType.Text) {
      this.addDetail({ type: PostDetailType.Text, value: post.text });
      this.addDetail({ type: PostDetailType.Announcement, value: post.announcement });
    }

    if (post.type === PostType.Quote) {
      this.addDetail({ type: PostDetailType.Text, value: post.text });
      this.addDetail({ type: PostDetailType.QuoteAuthor, value: post.quoteAuthor });
    }

    if (post.type === PostType.Link) {
      this.addDetail({ type: PostDetailType.Link, value: post.link });
      this.addDetail({ type: PostDetailType.Description, value: post.description });
    }

    if (post.type === PostType.Video) {
      this.addDetail({ type: PostDetailType.Video, value: post.link });
    }
  }

  toggleLike(userId: string) {
    if (this.likes.includes(userId)) {
      this.likes = this.likes.filter(id => id !== userId);
    } else {
      this.likes.push(userId);
    }

    this.likesCount = this.likes.length;

    return this;
  }

  addDetail(detail: { type: PostDetailType, value: string }) {
    if (!detail.type || !detail.value) {
      return;
    }

    this.postsDetails.push(
      (new BlogPostDetailFactory()).create({
        id: undefined,
        postId: this.id,
        ...detail
      })
    );
  }

  public toPOJO(): CommonPostType {
    return {
      id: this.id,
      originalId: this.originalId,
      type: this.type,
      title: this.title,
      status: this.status,
      authorId: this.authorId,
      originalAuthorId: this.originalAuthorId,
      tags: this.tags,
      likes: this.likes,
      likesCount: this.likesCount,
      dateCreate: this.dateCreate,
      dateUpdate: this.dateUpdate,
      isReposted: this.isReposted,
      comments: this.comments?.map(comment => comment.toPOJO()) ?? [],
      postsDetails: this.postsDetails?.map(detail => detail.toPOJO()) ?? []
    } as CommonPostType;
  }

  public createResponseObject() {
    const { postsDetails, ...entity } = this.toPOJO();

    return { ...entity, ...BlogPostEntity.detailsToObject(postsDetails) };
  }

  public static detailsToObject(details) {
    return details.reduce((result, { type, value }) => {
      const detailName = type[0].toLowerCase() + type.slice(1);
      result[detailName] = value;
      return result;
    }, {});
  }
}
