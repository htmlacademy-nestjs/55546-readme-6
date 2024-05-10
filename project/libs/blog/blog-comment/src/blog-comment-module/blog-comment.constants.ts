export const MAX_COMMENTS_COUNT = 50;

export const DEFAULT_PAGE_COUNT = 1;

export const CommentLength = {
  Min: 10,
  Max: 300
} as const;

export const BlogCommentValidateMessage = {
  MessageIsEmpty: 'The message is empty',
  InvalidID: 'Invalid mongo id',
  MessageLesserMin: `The message is less than the minimum acceptable value ${CommentLength.Min}`,
  MessageGreaterMax: `Message greater than maximum allowed value ${CommentLength.Max}`,
} as const;
