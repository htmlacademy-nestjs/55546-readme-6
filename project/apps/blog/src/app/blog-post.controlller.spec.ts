import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { BlogPostModule } from '@project/blog-post';
import { PrismaClientService } from '@project/blog-models';
import request from 'supertest';
import { PostStatus, PostType, PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { MockJwtAuthGuard, blogSeed, existedUserData, otherUser } from '@project/testing';
import { LinkPost, PhotoPost, Post, QuotePost, SortDirection, TextPost, VideoPost } from '@project/shared/core';
import { createJWTPayload } from '@project/shared/helpers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'node:path';
import { sign } from 'jsonwebtoken';
import { CheckAuthGuard } from '@project/guards';

describe('Testing BlogPost Controller', () => {
  let app: INestApplication;
  let authToken: string;
  let textPost: TextPost;
  let linkPost: LinkPost;
  let videoPost: VideoPost;
  let quotePost: QuotePost;
  let photoPost: PhotoPost;
  let repostedPost: Post;
  let testPrismaClient: PrismaClient;

  beforeAll(async () => {
    testPrismaClient = new PrismaClient({
      datasourceUrl: 'postgresql://admin:test@localhost:5434/readmy_blog'
    });

    execSync('npx nx run blog:db:reset-test');

    await blogSeed.bootstrap(testPrismaClient);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BlogPostModule,
        ConfigModule.forRoot({
          isGlobal: true,
          cache: false,
          envFilePath: path.resolve(__dirname, '../../../account/account.env')
        })
      ],
      providers: [ConfigService]
    })
      .overrideProvider(PrismaClientService)
      .useValue(testPrismaClient)
      .overrideGuard(CheckAuthGuard)
      .useClass(MockJwtAuthGuard.setJwtPath('JWT_ACCESS_TOKEN_SECRET'))
      .compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const accessTokenPayload = createJWTPayload(existedUserData);

    await app.init();

    const configService = module.get(ConfigService);
    authToken = sign(accessTokenPayload, configService.get('JWT_ACCESS_TOKEN_SECRET'));
  });

  it('find all -> success', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/posts').expect(200);

    expect(body.totalPages).toBe(1);
    expect(body.totalItems).toBe(4);
    expect(body.currentPage).toBe(1);
  });

  it('find with query conditions -> success', async () => {
    // check a pagination
    const { body } = await request(app.getHttpServer())
      .get('/posts').query({ limit: 2, page: 2 }).expect(200);

    expect(body.totalPages).toBe(2);
    expect(body.totalItems).toBe(4);
    expect(body.currentPage).toBe(2);

    // check sort by comments count
    const { body: body2 } = await request(app.getHttpServer())
      .get('/posts').query({ sortByComments: SortDirection.Asc }).expect(200);

    expect(body2.entities[0].comments.length).toBe(0);

    const { body: body3 } = await request(app.getHttpServer())
      .get('/posts').query({ sortByComments: SortDirection.Desc }).expect(200);

    expect(body3.entities[0].comments.length).toBe(5);

    // check sort by likes count
    const { body: body4 } = await request(app.getHttpServer())
      .get('/posts').query({ sortByLikes: SortDirection.Asc }).expect(200);

    expect(body4.entities[0].likes.length).toBe(0);

    const { body: body5 } = await request(app.getHttpServer())
      .get('/posts').query({ sortByLikes: SortDirection.Desc }).expect(200);

    expect(body5.entities[0].likes.length).toBe(2);

    // check search by tag
    const { body: body6 } = await request(app.getHttpServer())
      .get('/posts').query({ tag: 'new' }).expect(200);

    expect(body6.totalItems).toBe(1);

    // check search by type
    const { body: body7 } = await request(app.getHttpServer())
      .get('/posts').query({ type: PostType.Video }).expect(200);

    expect(body7.entities[0].type).toBe(PostType.Video);

    // check sort by date
    const { body: body8 } = await request(app.getHttpServer())
      .get('/posts').query({ sortDirection: SortDirection.Asc }).expect(200);
    expect(new Date(body8.entities[0].dateCreate).getFullYear()).toBe(2019);

    const { body: body9 } = await request(app.getHttpServer())
      .get('/posts').query({ sortDirection: SortDirection.Desc }).expect(200);

    expect(new Date(body9.entities[0].dateCreate).getFullYear()).toBe(2021);
  });

  it('search by title -> success', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/posts/search').query({ title: 'post' }).expect(200);

    expect(body.length).toBe(3);

    const { body: body2 } = await request(app.getHttpServer())
      .get('/posts/search').query({ title: 'non-existed title' }).expect(200);

    expect(body2.length).toBe(0);
  });

  it('get posts after the particular date -> success', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/posts/find-after-date')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ date: new Date('2021-01-01') })
      .expect(200);

    expect(body.length).toBe(2);
  });

  it('get posts by the author id -> success', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/posts/user/${otherUser.id}`)
      .expect(200);

    expect(body.totalItems).toBe(3);
  });

  it('get posts by the author id -> fail', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/posts/user/id`)
      .expect(200);

    expect(body.totalItems).toBe(0);
  });

  it('error upon creating post by an unauthorized user', async () => {
    await request(app.getHttpServer()).post('/posts').expect(HttpStatus.UNAUTHORIZED);
  });

  it('error when transfer an empty post object upon creating a post', async () => {
    const { body: postErrors } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors.message).toHaveLength(6);
  });

  it('getting errors upon creating a post when transfer empty status and type fields', async () => {
    const { body: postErrors } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Post title' })
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors.message).toHaveLength(4);
  });

  it('getting errors upon creating a post when transfer wrong status field value', async () => {
    const { body: postErrors } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Post title', status: 'WrongStatus' })
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors.message).toHaveLength(3);
  });

  it('getting errors upon creating a post when transfer an empty type field', async () => {
    const { body: postErrors } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Post title', status: PostStatus.Draft })
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors.message).toHaveLength(2);
  });

  it('getting errors upon creating a post when transfer wrong type field value', async () => {
    const { body: postErrors } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Post title', status: PostStatus.Draft, type: 'WrongType' })
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors.message).toHaveLength(1);
  });

  it('getting errors upon creating a post when transfer a wrong value of tags', async () => {
    const { body: postErrors } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Post title',
        status: PostStatus.Draft,
        type: PostType.Text,
        tags: ['asdasddd', 'sdfsd', 'sdfsdfsdf', ' sdf', 'sdfff', 'dgdf dfgdfgdfg dfgdfg', 'fsdf', 'fffs', 'sddd']
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors.message).toHaveLength(2);

    const { body: postErrors2 } = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Post title',
        status: PostStatus.Draft,
        type: PostType.Text,
        tags: ['sdfsd', 'sdfsdfsdf', 'dgdf dfgdfgdfg dfgdfg', 'fsdf', 'fffs', 'sddd']
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(postErrors2.message).toHaveLength(1);
  });

  it('processing of all common fields was successful', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Post title',
        status: PostStatus.Draft,
        type: PostType.Text,
        tags: ['sdfsd', 'sdfsdf', 'fsdf', 'fffs', 'sddd']
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('create new text post -> success', async () => {
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Create text post',
        type: PostType.Text,
        status: PostStatus.Draft,
        authorId: existedUserData.id,
        tags: ['created', 'text'],
        text: 'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.',
        announcement: 'Post announcement Lorem ipsum dolor sit amet, officia excepteur'
      })
      .expect(HttpStatus.CREATED);

    textPost = result.body;
  });

  it('error upon updating when transfer a wrong post id', async () => {
    const UPDATED_POST_TITLE = 'Updated text post';

    await request(app.getHttpServer())
      .patch(`/posts/wromg-id`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Text,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
        text: 'Updated Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.',
        announcement: 'Updated Post announcement Lorem ipsum dolor sit amet, officia excepteur'
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('update text post -> success', async () => {
    const UPDATED_POST_TITLE = 'Updated text post';

    const { body: post } = await request(app.getHttpServer())
      .patch(`/posts/${textPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Text,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
        text: 'Updated Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.',
        announcement: 'Updated Post announcement Lorem ipsum dolor sit amet, officia excepteur'
      })
      .expect(HttpStatus.OK);

    expect(post.title).toBe(UPDATED_POST_TITLE);
    expect(post.status).toBe(PostStatus.Published);
    expect(post.tags).toContain('updated');
    expect(post.text.toLowerCase()).toContain('updated');
    expect(post.announcement.toLowerCase()).toContain('updated');

    textPost = post;
  });

  it('update text post -> fail', async () => {
    const UPDATED_POST_TITLE = 'Updated text post';

    const { body } = await request(app.getHttpServer())
      .patch(`/posts/${textPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Text,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(body.errors.announcement).toBeDefined();
    expect(body.errors.text).toBeDefined();
  });

  it('create new link post -> success', async () => {
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Create link post',
        type: PostType.Link,
        status: PostStatus.Draft,
        authorId: existedUserData.id,
        tags: ['created', 'link'],
        link: 'https://test-link-address.ru',
        description: 'Link post description'
      })
      .expect(HttpStatus.CREATED);

    linkPost = result.body;
  });

  it('update link post -> success', async () => {
    const UPDATED_POST_TITLE = 'Updated link post';

    const { body: post } = await request(app.getHttpServer())
      .patch(`/posts/${linkPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Link,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
        link: 'https://updated-test-link-address.ru',
        description: 'Updated link post description'
      })
      .expect(HttpStatus.OK);

    expect(post.title).toBe(UPDATED_POST_TITLE);
    expect(post.status).toBe(PostStatus.Published);
    expect(post.tags).toContain('updated');
    expect(post.link).toContain('updated');
    expect(post.description.toLowerCase()).toContain('updated');

    linkPost = post;
  });

  it('update text post -> fail', async () => {
    const UPDATED_POST_TITLE = 'Updated link post';

    const { body } = await request(app.getHttpServer())
      .patch(`/posts/${linkPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Link,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(body.errors.link).toBeDefined();
    expect(body.errors.description).toBeDefined();
  });

  it('create new video post -> success', async () => {
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Create video post',
        type: PostType.Video,
        status: PostStatus.Draft,
        authorId: existedUserData.id,
        tags: ['created', 'video'],
        link: 'https://www.youtube.com/video-link'
      })
      .expect(HttpStatus.CREATED);

    videoPost = result.body;
  });

  it('update video post -> success', async () => {
    const UPDATED_POST_TITLE = 'Updated video post';

    const { body: post } = await request(app.getHttpServer())
      .patch(`/posts/${videoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Video,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
        link: 'https://www.youtube.com/updated-video-link'
      })
      .expect(HttpStatus.OK);

    expect(post.title).toBe(UPDATED_POST_TITLE);
    expect(post.status).toBe(PostStatus.Published);
    expect(post.tags).toContain('updated');
    expect(post.video).toContain('updated');

    videoPost = post;
  });

  it('update video post -> fail', async () => {
    const UPDATED_POST_TITLE = 'Updated video post';

    const { body } = await request(app.getHttpServer())
      .patch(`/posts/${videoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Link,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(body.errors.link).toBeDefined();
  });

  it('create new quote post -> success', async () => {
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Create quote post',
        type: PostType.Quote,
        status: PostStatus.Draft,
        authorId: existedUserData.id,
        tags: ['created', 'quote'],
        text: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        quoteAuthor: 'Some author name'
      })
      .expect(HttpStatus.CREATED);

    quotePost = result.body;
  });

  it('update quote post -> success', async () => {
    const UPDATED_POST_TITLE = 'Updated quote post';

    const { body: post } = await request(app.getHttpServer())
      .patch(`/posts/${quotePost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Quote,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
        text: 'Updated Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        quoteAuthor: 'Updated some author name'
      })
      .expect(HttpStatus.OK);

    expect(post.title).toBe(UPDATED_POST_TITLE);
    expect(post.status).toBe(PostStatus.Published);
    expect(post.tags).toContain('updated');
    expect(post.text.toLowerCase()).toContain('updated');
    expect(post.quoteAuthor.toLowerCase()).toContain('updated');

    quotePost = post;
  });

  it('update quote post -> fail', async () => {
    const UPDATED_POST_TITLE = 'Updated quote post';

    const { body } = await request(app.getHttpServer())
      .patch(`/posts/${quotePost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Quote,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(body.errors.text).toBeDefined();
    expect(body.errors.quoteAuthor).toBeDefined();
  });

  it('create new photo post -> success', async () => {
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Create photo post',
        type: PostType.Photo,
        status: PostStatus.Draft,
        authorId: existedUserData.id,
        tags: ['created', 'photo'],
        photoId: '664228e8d67b36ef7c221f8e'
      })
      .expect(HttpStatus.CREATED);

    photoPost = result.body;
  });

  it('update photo post -> success', async () => {
    const UPDATED_POST_TITLE = 'Updated photo post';
    const UPDATED_PHOTO_ID = '661022d3615ce5c3c722054f';

    const { body: post } = await request(app.getHttpServer())
      .patch(`/posts/${photoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Photo,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
        photoId: UPDATED_PHOTO_ID
      })
      .expect(HttpStatus.OK);

    expect(post.title).toBe(UPDATED_POST_TITLE);
    expect(post.status).toBe(PostStatus.Published);
    expect(post.tags).toContain('updated');
    expect(post.photo).toBe(UPDATED_PHOTO_ID);

    photoPost = post;
  });

  it('update photo post -> fail', async () => {
    const UPDATED_POST_TITLE = 'Updated photo post';

    const { body } = await request(app.getHttpServer())
      .patch(`/posts/${photoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: UPDATED_POST_TITLE,
        type: PostType.Photo,
        status: PostStatus.Published,
        authorId: existedUserData.id,
        tags: ['created', 'text', 'updated'],
      })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(body.errors.photoId).toBeDefined();
  });

  it('get a post by id', async () => {
    const { body: post } = await request(app.getHttpServer())
      .get(`/posts/${textPost.id}`)
      .expect(HttpStatus.OK);

    expect(post.title).toBe(textPost.title);
  });

  it('getting a non-existed post by id', async () => {
    await request(app.getHttpServer())
      .get(`/posts/non-existed-post-id`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('an error deleting post without an jwt token', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${textPost.id}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('deleting a post by id', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${textPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('deleting a non-existed post by id', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${textPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('deleting a someone else\'s post by id', async () => {
    const { body: { entities: [post] } } = await request(app.getHttpServer())
      .get(`/posts/user/${otherUser.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('adding like to a post without an jwt token', async () => {
    await request(app.getHttpServer())
      .patch(`/posts/like/${videoPost.id}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('check adding and removing likes to a post', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/posts/like/${videoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(body.likes).toContain(existedUserData.id);

    const { body: body2 } = await request(app.getHttpServer())
      .patch(`/posts/like/${videoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(body2.likes.includes(existedUserData.id)).toBeFalsy();
  });

  it('adding like to a non-existed post', async () => {
    await request(app.getHttpServer())
      .patch(`/posts/like/${textPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('reposting someone else\'s post by id without jwt token', async () => {
    const { body: { entities: [post] } } = await request(app.getHttpServer())
      .get(`/posts/user/${otherUser.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post(`/posts/repost/${post.id}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('reposting someone else\'s post by id', async () => {
    const { body: { entities: [post] } } = await request(app.getHttpServer())
      .get(`/posts/user/${otherUser.id}`)
      .expect(HttpStatus.OK);

    const { body } = await request(app.getHttpServer())
      .post(`/posts/repost/${post.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.CREATED);

    expect(body.title).toBe(post.title);
    expect(body.type).toBe(post.type);
    expect(body.authorId).toBe(existedUserData.id);
    expect(body.isReposted).toBeTruthy();
    expect(body.originalId).toBe(post.id);
    expect(body.originalAuthorId).toBe(post.authorId);

    repostedPost = body;
  });

  it('reposting already the reposted post', async () => {
    await request(app.getHttpServer())
      .post(`/posts/repost/${repostedPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('reposting the own post', async () => {
    await request(app.getHttpServer())
      .post(`/posts/repost/${videoPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('reposting a post with status is draft', async () => {
    await request(app.getHttpServer())
      .post(`/posts/repost/${blogSeed.linkPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('reposting a non-existed post', async () => {
    await request(app.getHttpServer())
      .post(`/posts/repost/${textPost.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('getting the contend feed of user without jwt token', async () => {
    await request(app.getHttpServer())
      .post(`/posts/content-ribbon`)
      .send({ usersIds: [existedUserData.id, otherUser.id] })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('getting the contend feed of user', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/posts/content-ribbon`)
      .send({ usersIds: [existedUserData.id, otherUser.id] })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(body.totalItems).toBe(9);
  });

  afterAll(async () => {
    // execSync('npx nx run blog:db:reset-test');
    await testPrismaClient.$disconnect();
    await app.close();
  });
});
