import { CommonPostType, Entity, LinkPost, PhotoPost, QuotePost, TextPost, VideoPost } from '@project/shared/core';
import { StorableEntity } from '@project/shared/core';
import { BlogCommentEntity, BlogCommentFactory } from '@project/blog-comment';
import { BlogPostDetailEntity, BlogPostDetailFactory } from '@project/blog-post-detail';
import { PostDetailType, PostType, PostStatus } from '@prisma/client';

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
  public originalId: string;
  public type: PostType;
  public status: PostStatus;
  public authorId: string;
  public originalAuthorId: string;
  public title: string;
  public tags?: string[];
  public likes?: string[];
  public dateCreate?: Date;
  public dateUpdate?: Date;
  public isReposted: boolean;
  public comments: BlogCommentEntity[];

  // public photoId?: string;
  // public text?: string;
  // public announcement?: string;
  // public quoteAuthor?: string;
  // public link?: string;
  // public description?: string;

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

    const blogPostDetailFactory = new BlogPostDetailFactory();
    this.postsDetails = post.postsDetails ?
      post.postsDetails.map(postDetail => blogPostDetailFactory.create(postDetail))
      : this.fillDetails(post);
  }

  fillDetails(post: any): BlogPostDetailEntity[] {
    if (post.type === 'Photo') {
      this.addDetail({ type: PostDetailType.Photo, value: post.photoId });
    }

    if (post.type === 'Text') {
      this.addDetail({ type: PostDetailType.Text, value: post.text });
      this.addDetail({ type: PostDetailType.Announcement, value: post.announcement });
    }

    if (post.type === 'Quote') {
      this.addDetail({ type: PostDetailType.Text, value: post.text });
      this.addDetail({ type: PostDetailType.QuoteAuthor, value: post.quoteAuthor });
    }

    if (post.type === 'Link') {
      this.addDetail({ type: PostDetailType.Link, value: post.link });
      this.addDetail({ type: PostDetailType.Description, value: post.description });
    }

    if (post.type === 'Video') {
      this.addDetail({ type: PostDetailType.Video, value: post.link });
    }

    return this.postsDetails;
  }

  toggleLike(userId: string) {
    if (this.likes.includes(userId)) {
      this.likes = this.likes.filter(id => id !== userId);
    } else {
      this.likes.push(userId);
    }

    return this;
  }

  addDetail(detail: { type: PostDetailType, value: string }) {
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
      dateCreate: this.dateCreate,
      dateUpdate: this.dateUpdate,
      isReposted: this.isReposted,
      comments: this.comments?.map(comment => comment.toPOJO()) ?? [],
      postsDetails: []
    } as CommonPostType;
  }

  // public toRepostedPOJO(originalId: string, authorId: string): any {
  //   const { id, ...pojoEntity } = this.toPOJO();
  //   return {
  //     ...pojoEntity,
  //     originalId,
  //     authorId,
  //     dateCreate: new Date(),
  //     dateUpdate: new Date(),
  //     isReposted: true,
  //   };
  // }

  public detailsToObject() {
    return this.postsDetails.reduce((result, detail) => {
      result[detail.type.toLowerCase()] = detail.value;
      return result;
    }, {});
  }

  public createResponseObject() {
    const { postsDetails, ...entity } = this.toPOJO();

    return { ...entity, ...this.detailsToObject() };
  }
}
