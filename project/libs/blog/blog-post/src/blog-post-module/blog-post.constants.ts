import { SortDirection } from '@project/shared/core';

export const DEFAULT_POST_COUNT_LIMIT = 25;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
export const DEFAULT_PAGE_COUNT = 1;

export const MAX_SEARCH_COUNT = 20;

export const PostTitleLength = {
  Min: 20,
  Max: 50
};

export const PostAnnounceLength = {
  Min: 50,
  Max: 255
};

export const PostTextLength = {
  Min: 100,
  Max: 1024
};

export const PostQuoteTextLength = {
  Min: 20,
  Max: 300
};

export const PostQuoteAuthorLength = {
  Min: 3,
  Max: 50
};

export const MAX_POST_TAGS = 8;

export const YOUTUBE_VALIDATE_LINK_REGEXP = /^https:\/\/www\.youtube.com.*/;

export const TAG_VALIDATE_REGEXP = /^([a-zа-я]{3,8})$/;

export const MAX_POST_LINK_LENGTH = 300;

export const MAX_POST_PHOTO_SIZE = 1000000;

export const AVAILABLE_POST_PHOTO_TYPE = /(jpe?g|png)/;

export const BlogPostValidateMessage = {
  UserNotAuthor: 'The user is not the author of this post',
  UserAlreadyAuthor: 'You are already the author of this post',
  CannotRepostDraft: 'You cannot repost posts in draft status',
  AlreadyReposted: 'You are already reposted this post',
  LikeOnlyPublished: 'You can only like published articles'
} as const;

export const ParamDescription = {
  UserId: 'User ID',
  PostId: 'Post ID',
} as const;

export const QueryDescription = {
  PaginationList: 'Query parameters for pagination by list of posts',
  SearchedTitle: 'Post title to search for related posts',
  LastDate: 'Last mailing date'
} as const;

export const PostResponseMessage = {
  FoundPostList: 'Successfully retrieving a list of messages based on request parameters',
  PostCreated: 'The new post has been successfully created.',
  PostValidationError: 'Validation error when creating post',
  PostFound: 'Post found',
  PostNotFound: 'Post not found',
  PostDeleted: 'The post has been successfully deleted.',
  PostUpdated: 'The post has been successfully updated.',
  CommentCreated: 'The comment has been successfully created.',
  CommentValidationError: 'Validation error when creating comment',
  UserNotFound: 'User not found',
  JwtAuthError: 'Failed user authorization with jwt',
} as const;
