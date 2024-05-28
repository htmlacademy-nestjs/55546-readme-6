import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { BlogCommentModule } from "@project/blog-comment";
import { PrismaClientService } from "@project/blog-models";
import { CheckAuthGuard } from "@project/guards";
import { Comment } from "@project/shared/core";
import { createJWTPayload } from "@project/shared/helpers";
import { MockJwtAuthGuard, blogSeed, existedUserData } from "@project/testing";
import { sign } from "jsonwebtoken";
import { execSync } from "node:child_process";
import path from "node:path";
import request from 'supertest';

const POST = blogSeed.quotePost;

const COMMENT_TEXT_MESSAGE = 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.';

const COMMENT_OTHER_USER = blogSeed.comments.find(comment => comment.authorId !== existedUserData.id);

describe('Testing BlogPostCommentController', () => {
  let app: INestApplication;
  let authToken: string;
  let comment: Comment;
  let testPrismaClient: PrismaClient;

  beforeAll(async () => {
    testPrismaClient = new PrismaClient({
      datasourceUrl: 'postgresql://admin:test@localhost:5434/readmy_blog'
    });

    execSync('npx nx run blog:db:reset-test');

    await blogSeed.bootstrap(testPrismaClient);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BlogCommentModule,
        ConfigModule.forRoot({
          isGlobal: true,
          cache: false,
          envFilePath: path.resolve(__dirname, '../../../account/account.env')
        })
      ]
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

  it('creating a comment without jwt token', async () => {
    await request(app.getHttpServer())
      .post(`/posts/${POST.id}/comments`)
      .send({ message: COMMENT_TEXT_MESSAGE })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('creating a new comment', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/posts/${POST.id}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ message: COMMENT_TEXT_MESSAGE })
      .expect(HttpStatus.CREATED);

    comment = body;
  });

  it('creating a new comment without message field', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/posts/${POST.id}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toHaveLength(4);
  });

  it('creating a new comment for a non-existed post', async () => {
    await request(app.getHttpServer())
      .post(`/posts/non-existed-id/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ message: COMMENT_TEXT_MESSAGE })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('getting all comments by the post id', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/posts/${POST.id}/comments/find`)
      .expect(HttpStatus.OK);

    expect(body.totalItems).toBe(6);
  });

  it('getting a comment by id', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/posts/${POST.id}/comments/${comment.id}`)
      .expect(HttpStatus.OK);

    expect(body.id).toBe(comment.id);
  });

  it('getting a non-existed comment by id', async () => {
    await request(app.getHttpServer())
      .get(`/posts/${POST.id}/comments/non-existed-id`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('deleting a comment without jwt token', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${POST.id}/comments/${comment.id}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('deleting a non-existed comment by id', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${POST.id}/comments/non-existed-id`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('deleting a comment someone else\'s author', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${POST.id}/comments/${COMMENT_OTHER_USER.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('deleting a comment by id', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${POST.id}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .delete(`/posts/${POST.id}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await testPrismaClient.$disconnect();
    await app.close();
  });
});
