import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';

const POST_MIN_DATE = '2019-01-01';

const POSTS_COUNT = 15;

const POSTS_LIKES_COUNT = 20;

const POSTS_COMMENTS_COUNT = 50;

const POSTS_DETAILS_COUNT = 150;

const POSTS_TYPES = ['Video', 'Text', 'Quote', 'Photo', 'Link'];

const POSTS_STATUSES = ['Draft', 'Published'];

const POSTS_TAGS = ['nature', 'globe', 'photo', 'canon', 'lands', 'random', 'new'];

const POSTS_DETAILS_TYPES = ['Video', 'Text', 'QuoteAuthor', 'Photo', 'Link', 'Description', 'Announcement'] as const;

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

const getRandomValue = (dataList: any[]) =>
  dataList[Math.floor(Math.random() * dataList.length)];

const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + ((end.getTime() - start.getTime()) * Math.random()));

const generatePost = () => {

  return {
    id: randomUUID(),
    type: getRandomValue(POSTS_TYPES),
    status: getRandomValue(POSTS_STATUSES),
    authorId: new Types.ObjectId().toString(),
    title: getRandomValue(POSTS_TITLES_LIST),
    tags: [...new Set(
      Array.from({ length: Math.floor(Math.random() * POSTS_TAGS.length) }, () => {
        return getRandomValue(POSTS_TAGS)
      })
    )],
    dateCreate: randomDate(new Date(POST_MIN_DATE), new Date()),
    dateUpdate: new Date(),
    isReposted: !!(Math.round(Math.random() * 1)),
    likes: Array.from({ length: Math.floor(Math.random() * POSTS_LIKES_COUNT) }, () => {
      return new Types.ObjectId().toString();
    })
  };
}

type PostType = ReturnType<typeof generatePost>;

const generateComment = (post: PostType) => {

  return {
    id: randomUUID(),
    postId: post.id,
    authorId: new Types.ObjectId().toString(),
    text: getRandomValue(COMMENTS_TEXTS),
    dateCreate: randomDate(new Date(COMMENT_MIN_DATE), new Date())
  };
}

const generatePostDetails = (post: PostType, type: typeof POSTS_DETAILS_TYPES[number]) => {

  return {
    id: randomUUID(),
    postId: post.id,
    type,
    value: (Math.random() + 1).toString(50)
  };
}

const seedDb = async (prismaClient: PrismaClient) => {
  const posts = Array.from({ length: POSTS_COUNT }, () => generatePost());
  await Promise.all(
    posts.map(post => prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: post
    }))
  );

  const comments = Array.from({ length: POSTS_COMMENTS_COUNT },
    () => generateComment(getRandomValue(posts)));
  await Promise.all(
    comments.map(comment => prismaClient.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: comment
    }))
  );

  const postsDetails = Array.from({ length: POSTS_DETAILS_COUNT },
    () => generatePostDetails(
      getRandomValue(posts),
      getRandomValue(POSTS_DETAILS_TYPES as any)
    ));
  await Promise.all(
    postsDetails.map(postsDetail => prismaClient.postsDetails.upsert({
      where: { id: postsDetail.id },
      update: {},
      create: postsDetail
    }))
  );

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
