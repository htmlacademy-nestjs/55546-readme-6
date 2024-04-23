import { CommonPostType, Entity, LinkPost, PhotoPost, PostStatus, PostType, QuotePost, TextPost, VideoPost } from '@project/shared/core';
import { StorableEntity } from '@project/shared/core';
import { BlogCommentEntity, BlogCommentFactory } from '@project/blog-comment';

function isPhotoType(obj: any): obj is PhotoPost {
  return obj.type === PostType.Photo;
}

function isTextType(obj: any): obj is TextPost {
  return obj.type === PostType.Text;
}

function isLinkType(obj: any): obj is LinkPost {
  return obj.type === PostType.Link;
}

function isVideoType(obj: any): obj is VideoPost {
  return obj.type === PostType.Video;
}

function isQuoteType(obj: any): obj is QuotePost {
  return obj.type === PostType.Quote;
}

export class BlogPostEntity extends Entity implements StorableEntity<CommonPostType> {
  public type: PostType;
  public status: PostStatus;
  public authorId: string;
  public title: string;
  public tags?: string[];
  public likes?: string[];
  public dateCreate?: Date;
  public dateUpdate?: Date;
  public isReposted: boolean;
  public comments: BlogCommentEntity[];

  public photo?: string;
  public text?: string;
  public announcement?: string;
  public quoteAuthor?: string;
  public link?: string;
  public description?: string;

  constructor(post?: CommonPostType) {
    super();
    this.populate(post);
  }

  public populate(post?: CommonPostType) {
    if (!post) {
      return;
    }

    this.id = post.id ?? undefined;
    this.title = post.title ?? undefined;
    this.type = post.type ?? undefined;
    this.status = post.status ?? undefined;
    this.authorId = post.authorId ?? undefined;
    this.tags = post.tags ?? [];
    this.likes = post.likes ?? [];
    this.dateCreate = post.dateCreate ?? new Date();
    this.dateUpdate = post.dateUpdate ?? new Date();

    const blogCommentFactory = new BlogCommentFactory();
    this.comments = post.comments?.map(comment => blogCommentFactory.create(comment)) ?? [];

    if (isPhotoType(post)) {
      this.photo = post.photo ?? undefined;
    }

    if (isTextType(post)) {
      this.text = post.text ?? undefined;
      this.announcement = post.announcement ?? undefined;
    }

    if (isQuoteType(post)) {
      this.text = post.text ?? undefined;
      this.quoteAuthor = post.quoteAuthor ?? undefined;
    }

    if (isLinkType(post)) {
      this.link = post.link ?? undefined;
      this.description = post.description ?? undefined;
    }

    if (isVideoType(post)) {
      this.link = post.link ?? undefined;
    }
  }

  public toPOJO(): CommonPostType {
    const basePost: { [key: string]: any } = {
      id: this.id,
      type: this.type,
      title: this.title,
      status: this.status,
      authorId: this.authorId,
      tags: this.tags,
      likes: this.likes,
      dateCreate: this.dateCreate,
      dateUpdate: this.dateUpdate,
      isReposted: this.isReposted,
      comments: this.comments?.map(comment => comment.toPOJO()) ?? []
    };

    if (isPhotoType(this)) {
      basePost.photo = this.photo;
    }

    if (isTextType(this)) {
      basePost.text = this.text;
      basePost.announcement = this.announcement;
    }

    if (isQuoteType(this)) {
      basePost.text = this.text;
      basePost.quoteAuthor = this.quoteAuthor;
    }

    if (isLinkType(this)) {
      basePost.link = this.link;
      basePost.description = this.description;
    }

    if (isVideoType(this)) {
      basePost.link = this.link;
    }

    return basePost as CommonPostType;
  }
}
