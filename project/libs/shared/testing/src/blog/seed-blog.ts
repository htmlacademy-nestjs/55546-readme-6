import { PostDetailType, PostStatus, PostType, PrismaClient } from '@prisma/client';
import { existedUserData, otherUser } from '../account/testing-accounts.users';

const DetailValue = {
  PhotoId: '664228e8d67b36ef7c221f8e',
  Text: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  Announcement: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  QuoteAuthor: 'Some Quote Author',
  LinkUrl: 'https://htmlacademy.ru',
  Description: 'Link post description...',
  VideoUrl: 'https://www.youtube.com/test'
};

export const textPost = {
  id: '2b642c00-4bbd-49c2-8de1-ed72d16dd21c',
  tags: ['text', 'new', 'first'],
  type: PostType.Text,
  likes: [],
  title: 'test title',
  status: PostStatus.Draft,
  authorId: existedUserData.id,
  dateCreate: new Date('2015-01-02'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 0,
  originalId: '',
  originalAuthorId: ''
};

export const linkPost = {
  id: 'f9580dae-eba9-4ae2-9f1f-012a3f28e38d',
  tags: [],
  type: PostType.Link,
  likes: [otherUser.id, existedUserData.id],
  title: 'Link post title',
  status: PostStatus.Draft,
  authorId: otherUser.id,
  dateCreate: new Date('2017-01-02'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 2,
  originalId: '',
  originalAuthorId: ''
};

export const videoPost = {
  id: '7eadc2fc-d3ea-4dcd-b5c2-4a3e7f2028d0',
  tags: ['video', 'youtube', 'nice', 'new'],
  type: PostType.Video,
  likes: [],
  title: 'Video title',
  status: PostStatus.Draft,
  authorId: existedUserData.id,
  dateCreate: new Date('2017-06-12'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 0,
  originalId: '',
  originalAuthorId: ''
};

export const quotePost = {
  id: 'a2b34a3c-ff87-4fbb-812f-d73744b03003',
  tags: ['old', 'think'],
  type: PostType.Quote,
  likes: [existedUserData.id],
  title: 'Quote post info',
  status: PostStatus.Published,
  authorId: otherUser.id,
  dateCreate: new Date('2019-09-15'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 1,
  originalId: '',
  originalAuthorId: ''
};

const photoPost = {
  id: '50e3a6d4-4abc-403d-b48a-7073276e6c04',
  tags: ['picture', 'nature', 'new', 'last', 'nice'],
  type: PostType.Photo,
  likes: [],
  title: 'Photo message',
  status: PostStatus.Published,
  authorId: existedUserData.id,
  dateCreate: new Date('2021-03-07'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 0,
  originalId: '',
  originalAuthorId: ''
};

const secondVideoPost = {
  id: '8043b62b-4292-4d8b-ac1c-1690ff6d8590',
  tags: ['second', 'text', 'info'],
  type: PostType.Video,
  likes: [],
  title: 'Second Video Post',
  status: PostStatus.Published,
  authorId: otherUser.id,
  dateCreate: new Date('2021-05-07'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 0,
  originalId: '',
  originalAuthorId: ''
};

export const secondLinkPost = {
  id: 'c93b99a1-3544-48a0-88cd-7059233e3c13',
  tags: [],
  type: PostType.Link,
  likes: [existedUserData.id, otherUser.id],
  title: 'Second link post title',
  status: PostStatus.Published,
  authorId: otherUser.id,
  dateCreate: new Date('2020-02-04'),
  dateUpdate: new Date(),
  isReposted: false,
  likesCount: 2,
  originalId: '',
  originalAuthorId: ''
};

export const posts = [textPost, linkPost, videoPost, quotePost, photoPost, secondVideoPost, secondLinkPost];

export const postsDetails = [
  // Text Post
  { postId: textPost.id, type: PostDetailType.Text, value: DetailValue.Text },
  { postId: textPost.id, type: PostDetailType.Announcement, value: DetailValue.Announcement },

  // Photo Post
  { postId: photoPost.id, type: PostDetailType.Photo, value: DetailValue.PhotoId },

  // Quote Post
  { postId: quotePost.id, type: PostDetailType.Text, value: DetailValue.Text },
  { postId: quotePost.id, type: PostDetailType.QuoteAuthor, value: DetailValue.QuoteAuthor },

  // Video Post
  { postId: videoPost.id, type: PostDetailType.Video, value: DetailValue.VideoUrl },

  // Link Post
  { postId: linkPost.id, type: PostDetailType.Link, value: DetailValue.LinkUrl },
  { postId: linkPost.id, type: PostDetailType.Link, value: DetailValue.Description },

  // Second Link Post
  { postId: secondLinkPost.id, type: PostDetailType.Link, value: DetailValue.LinkUrl },
  { postId: secondLinkPost.id, type: PostDetailType.Link, value: DetailValue.Description },

  // Second Video Post
  { postId: secondVideoPost.id, type: PostDetailType.Video, value: DetailValue.VideoUrl },
]

export const comments = [
  {
    id: '34f2c6b9-4a49-4211-8208-c5e6526f891d',
    postId: textPost.id,
    authorId: existedUserData.id,
    dateCreate: new Date('2016-01-02'),
    message: 'Encyclopedia enchanting caution screwdriver disapprove blade lyric addicted aunt mail?'
  },
  {
    id: 'a93572c6-48e3-497d-aed1-f3cb9178cdca',
    postId: textPost.id,
    authorId: otherUser.id,
    dateCreate: new Date('2016-05-07'),
    message: 'Employer straw stuff dam, parcel oxygen little girl arrow leg business lisa, somber decision without.'
  },
  {
    id: 'd27ee198-2149-4edd-9e21-06ce5992a342',
    postId: textPost.id,
    authorId: existedUserData.id,
    dateCreate: new Date('2016-05-09'),
    message: 'Order return bandana possibility quarrelsome, reward gaming retailer cone forgetful prickly hope?'
  },
  {
    id: 'f87afd4d-4461-47fd-bc29-23948c5d629e',
    postId: photoPost.id,
    authorId: existedUserData.id,
    dateCreate: new Date('2022-02-03'),
    message: 'Stir prefer viola defective responsibility peanut booklet, dependent canadian shirt ankle spain subtract, tip beyond.',
  },
  {
    id: '3a9565d9-1a4f-447c-8a26-39ad556ad211',
    postId: linkPost.id,
    authorId: existedUserData.id,
    dateCreate: new Date('2018-11-23'),
    message: 'Ophthalmologist tablecloth august cupcake preserve fail emery curly, lettuce unkempt clock steep!',
  },
  {
    id: 'd32eb386-80d0-404b-9ed7-d540c314985d',
    postId: quotePost.id,
    authorId: otherUser.id,
    dateCreate: new Date('2018-11-27'),
    message: 'Matter branch belligerent captain smooth metal arrest, kilogram pointless rinse.',
  },
  {
    id: '0fae2a51-47e2-47f4-92fe-337158c8d1bd',
    postId: quotePost.id,
    authorId: otherUser.id,
    dateCreate: new Date('2019-02-11'),
    message: 'Doll size crop laugh, juicy sock teeny-tiny betty stupendous attack punch, frame separated harmony lying.',
  },
  {
    id: '2f1559d9-2cd0-4fe1-856a-4f862cb8183d',
    postId: quotePost.id,
    authorId: existedUserData.id,
    dateCreate: new Date('2019-03-13'),
    message: 'Bounce buzz screwdriver mouse oak, wipe connection untidy, cinema illustrious.',
  },
  {
    id: '3149bc6f-3386-4281-b53e-0114c63018d2',
    postId: quotePost.id,
    authorId: existedUserData.id,
    dateCreate: new Date('2019-03-14'),
    message: 'Stepdaughter roll geese literate, wander cathedral intelligent, collision dimple dragonfly choke shirt, tabletop changeable motorboat.',
  },
  {
    id: '3d8d36b6-ca9e-48cf-8277-e4823fea362b',
    postId: quotePost.id,
    authorId: otherUser.id,
    dateCreate: new Date('2019-03-17'),
    message: 'Dry share advice obsequious asphalt green danger oven fog deceive.'
  },
];

const POSTS_TITLES_LIST = [
  'The Moon by Night',
  'Rat Of The Ancestors',
  'Arms and the Man',
  'Lucy In The Sky With Diamonds',
  'The Getting of Wisdom',
  'Beneath the Bleeding',
  'Warlocks Of Power',
  'Guests With A Cheeky Smile',
  'The Torment of Others'
];

const seedDb = async (prismaClient: PrismaClient) => {
  await Promise.all(
    posts.map(post => prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: post
    }))
  );

  await Promise.all(
    comments.map(comment => prismaClient.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: comment
    }))
  );

  await prismaClient.postsDetails.createMany({ data: postsDetails });
}

export async function bootstrap(prismaClient: PrismaClient) {
  try {
    await seedDb(prismaClient);
  } catch (error: unknown) {
    console.error('testing-seed-error', error);
    globalThis.process.exit(1);
  }
}
