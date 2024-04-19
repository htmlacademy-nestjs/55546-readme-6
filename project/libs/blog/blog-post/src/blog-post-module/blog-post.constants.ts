import { SortDirection } from '@project/shared/core';

export const DEFAULT_POST_COUNT_LIMIT = 10;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
export const DEFAULT_PAGE_COUNT = 1;

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
} as const;
