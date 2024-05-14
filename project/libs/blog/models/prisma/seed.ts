import { PostDetailType, PostType, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';

const usersIds = [
  '664228e8d67b36ef7c221f8e',
  '6641e7c30e1dd47aa62202d9',
  '6641e7cd0e1dd47aa62202da'
];

const DataCount = {
  Post: 30,
  Likes: 20,
  Comment: 50,
  Details: 150
};

const POST_MIN_DATE = '2019-01-01';

const POSTS_TYPES = ['Video', 'Text', 'Quote', 'Photo', 'Link'];

const POSTS_STATUSES = ['Draft', 'Published'];

const POSTS_TAGS = ['nature', 'globe', 'photo', 'canon', 'lands', 'random', 'new'];

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

const COMMENTS_TEXTS = [
  'Encyclopedia enchanting caution screwdriver disapprove blade lyric addicted aunt mail?',
  'Employer straw stuff dam, parcel oxygen little girl arrow leg business lisa, somber decision without.',
  'Order return bandana possibility quarrelsome, reward gaming retailer cone forgetful prickly hope?',
  'Stir prefer viola defective responsibility peanut booklet, dependent canadian shirt ankle spain subtract, tip beyond.',
  'Ophthalmologist tablecloth august cupcake preserve fail emery curly, lettuce unkempt clock steep!',
  'Matter branch belligerent captain smooth metal arrest, kilogram pointless rinse.',
  'Doll size crop laugh, juicy sock teeny-tiny betty stupendous attack punch, frame separated harmony lying.',
  'Bounce buzz screwdriver mouse oak, wipe connection untidy, cinema illustrious.',
  'Stepdaughter roll geese literate, wander cathedral intelligent, collision dimple dragonfly choke shirt, tabletop changeable motorboat.',
  'Dry share advice obsequious asphalt green danger oven fog deceive.'
];

const COMMENT_MIN_DATE = '2020-01-01';

const DetailValue = {
  PhotoId: '664228e8d67b36ef7c221f8e',
  Text: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  Announcement: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  QuoteAuthor: 'Some Quote Author',
  LinkUrl: 'https://htmlacademy.ru',
  Description: 'Link post description...',
  VideoUrl: 'https://www.youtube.com/test'
};

const getRandomValue = (dataList: any[]) =>
  dataList[Math.floor(Math.random() * dataList.length)];

const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + ((end.getTime() - start.getTime()) * Math.random()));

const generatePost = () => {
  const likes = Array.from({ length: Math.floor(Math.random() * DataCount.Likes) }, () => {
    return new Types.ObjectId().toString();
  });


  return {
    id: randomUUID(),
    originalId: null,
    type: getRandomValue(POSTS_TYPES),
    status: getRandomValue(POSTS_STATUSES),
    authorId: getRandomValue(usersIds),
    originalAuthorId: null,
    title: getRandomValue(POSTS_TITLES_LIST),
    tags: [...new Set(
      Array.from({ length: Math.floor(Math.random() * POSTS_TAGS.length) }, () => {
        return getRandomValue(POSTS_TAGS)
      })
    )],
    dateCreate: randomDate(new Date(POST_MIN_DATE), new Date()),
    dateUpdate: new Date(),
    isReposted: false,
    likesCount: likes.length,
    likes
  };
}

type BlogPostType = ReturnType<typeof generatePost>;

const generateComment = (post: BlogPostType) => {

  return {
    id: randomUUID(),
    postId: post.id,
    authorId: new Types.ObjectId().toString(),
    message: getRandomValue(COMMENTS_TEXTS),
    dateCreate: randomDate(new Date(COMMENT_MIN_DATE), new Date())
  };
}

const generatePostDetails = (post: BlogPostType) => {
  if (post.type === PostType.Photo) {
    return [
      { id: randomUUID(), postId: post.id, type: PostDetailType.Photo, value: DetailValue.PhotoId }
    ];
  }

  if (post.type === PostType.Text) {
    return [
      { id: randomUUID(), postId: post.id, type: PostDetailType.Text, value: DetailValue.Text },
      { id: randomUUID(), postId: post.id, type: PostDetailType.Announcement, value: DetailValue.Announcement }
    ];
  }

  if (post.type === PostType.Quote) {
    return [
      { id: randomUUID(), postId: post.id, type: PostDetailType.Text, value: DetailValue.Text },
      { id: randomUUID(), postId: post.id, type: PostDetailType.QuoteAuthor, value: DetailValue.QuoteAuthor }
    ];
  }

  if (post.type === PostType.Link) {
    return [
      { id: randomUUID(), postId: post.id, type: PostDetailType.Link, value: DetailValue.LinkUrl },
      { id: randomUUID(), postId: post.id, type: PostDetailType.Description, value: DetailValue.Description }
    ];
  }

  if (post.type === PostType.Video) {
    return [
      { id: randomUUID(), postId: post.id, type: PostDetailType.Video, value: DetailValue.VideoUrl }
    ];
  }

  return [];
}

const seedDb = async (prismaClient: PrismaClient) => {
  const posts = Array.from({ length: DataCount.Post }, () => generatePost());
  await Promise.all(
    posts.map(post => prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: post
    }))
  );

  const comments = Array.from({ length: DataCount.Comment },
    () => generateComment(getRandomValue(posts)));
  await Promise.all(
    comments.map(comment => prismaClient.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: comment
    }))
  );

  const postsDetails = posts.reduce((details: any[], post) => {
    return [...details, ...generatePostDetails(post)];
  }, []);

  await prismaClient.postsDetails.createMany({ data: postsDetails });

  console.log('Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
