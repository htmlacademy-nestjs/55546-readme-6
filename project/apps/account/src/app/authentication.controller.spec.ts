import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication, } from '@nestjs/common';
import { AuthenticationModule, JwtAuthGuard, JwtRefreshGuard, RefreshTokenService } from '@project/authentication';
import { ConfigModule } from '@nestjs/config';
import { getMongooseOptions, jwtConfig, mongoConfig, rabbitConfig } from '@project/account-config';
import path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogUserEntity, BlogUserRepository } from '@project/blog-user';
import { HttpService } from '@nestjs/axios';
import { NotifyService } from '@project/account-notify';
import request from 'supertest';
import {
  userData,
  existedUserData,
  otherUser,
  EXISTED_USER_PASSWORD,
  MockJwtAuthGuard,
  MockJwtRefreshGuard
} from '@project/testing';

const users = [existedUserData, otherUser];

let bearerAccessToken = null;
let bearerRefreshToken = null;

describe('Testing the AuthenticationController', () => {
  let app: INestApplication;
  let httpService: jest.Mocked<HttpService>;
  let blogUserRepository: BlogUserRepository;
  let refreshTokenService: RefreshTokenService;
  let notifyService: NotifyService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [jwtConfig, rabbitConfig, mongoConfig],
          envFilePath: path.resolve(__dirname, '../../account.env')
        }),
        MongooseModule.forRootAsync(getMongooseOptions()),
        AuthenticationModule
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard.setJwtPath('jwt.accessTokenSecret'))
      .overrideGuard(JwtRefreshGuard)
      .useClass(MockJwtRefreshGuard)
      .compile();

    app = module.createNestApplication();

    await app.init();

    blogUserRepository = module.get<BlogUserRepository>(BlogUserRepository);
    notifyService = module.get<NotifyService>(NotifyService);
    httpService = module.get(HttpService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);

    jest.spyOn(blogUserRepository, 'update').mockImplementation(async (data: BlogUserEntity) => {
      return;
    });

    jest.spyOn(blogUserRepository, 'findById').mockImplementation(async (id: string) => {
      const user = users.find(user => user.id === id);
      return user ? new BlogUserEntity(user) : null;
    });

    jest.spyOn(blogUserRepository, 'findByEmail').mockImplementation(async (email: string) => {
      const user = users.find(user => user.email === email);
      return user ? new BlogUserEntity(user) : null;
    });

    jest.spyOn(blogUserRepository, 'findListById').mockImplementation(async (listId: string[]) => {
      return users
        .filter(user => listId.includes(user.id))
        .map(user => new BlogUserEntity(user));
    });

    jest.spyOn(blogUserRepository, 'findPublishersList').mockImplementation(async (subscriberId: string) => {
      return users
        .filter(user => user.subscribers.includes(subscriberId))
        .map(user => new BlogUserEntity(user));
    });

    jest.spyOn(blogUserRepository, 'save').mockImplementation(async () => {
      return;
    });

    jest.spyOn(notifyService, 'registerSubscriber').mockImplementation(async () => {
      return true;
    });

    jest.spyOn(refreshTokenService, 'createRefreshSession').mockImplementation(async () => {
      return;
    });
  });

  it('register->success', async () => {
    jest.spyOn(httpService.axiosRef, 'get').mockImplementation(async () => {
      return { data: { subDirectory: '2024/05', hashName: 'hash-name.jpg' } };
    });

    return request(app.getHttpServer()).post(`/auth/register`).send(userData).expect(201);
  });

  it('register->error (user already exists)', async () => {
    jest.spyOn(httpService.axiosRef, 'get').mockImplementation(async () => {
      return { data: { subDirectory: '2024/05', hashName: 'hash-name.jpg' } };
    });

    return request(app.getHttpServer())
      .post(`/auth/register`)
      .send(existedUserData)
      .expect(409);
  });

  it('login->success', async () => {
    const { body: { accessToken, refreshToken } } = await request(app.getHttpServer())
      .post(`/auth/login`)
      .send({ email: existedUserData.email, password: EXISTED_USER_PASSWORD });

    bearerAccessToken = accessToken;
    bearerRefreshToken = refreshToken;

    expect(accessToken).toBeDefined();
  });

  it('login->fail', async () => {
    await request(app.getHttpServer())
      .post(`/auth/login`)
      .send({ email: 'not-found-user@mail.ru', password: EXISTED_USER_PASSWORD })
      .expect(404);

    await request(app.getHttpServer())
      .post(`/auth/login`)
      .send({ email: existedUserData.email, password: '' })
      .expect(401);
  });

  it('change-password->success', async () => {
    return request(app.getHttpServer())
      .patch(`/auth/change-password`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .send({ oldPassword: '123456', newPassword: '123456' })
      .expect(204);
  });

  it('change-password->fail', async () => {
    await request(app.getHttpServer())
      .patch(`/auth/change-password`)
      .send({ oldPassword: '123456', newPassword: '123456' })
      .expect(401);

    return request(app.getHttpServer())
      .patch(`/auth/change-password`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .send({ oldPassword: '1234567', newPassword: '123456' })
      .expect(401);
  });

  it('subscribe->success', async () => {
    const { body: firstResponse } = await request(app.getHttpServer())
      .patch(`/auth/subscribe`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .send({ authorId: otherUser.id })
      .expect(200);

    expect(firstResponse.subscribers).toContain(existedUserData.id);

    const { body: secondResponse } = await request(app.getHttpServer())
      .patch(`/auth/subscribe`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .send({ authorId: otherUser.id })
      .expect(200);

    expect(secondResponse.subscribers.length).toBe(0);
  });

  it('subscribe->fail', async () => {
    await request(app.getHttpServer())
      .patch(`/auth/subscribe`)
      .send({ authorId: otherUser.id })
      .expect(401);

    await request(app.getHttpServer())
      .patch(`/auth/subscribe`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .send({ authorId: '' })
      .expect(404);
  });

  it('get-users-by-id->success', async () => {
    const { body: firstResponse } = await request(app.getHttpServer())
      .post(`/auth/get-users-by-id`)
      .send({ usersIds: [existedUserData.id, otherUser.id] })
      .expect(200);

    expect(firstResponse.length).toBe(2);

    const { body: secondResponse } = await request(app.getHttpServer())
      .post(`/auth/get-users-by-id`)
      .expect(200);

    expect(secondResponse.length).toBe(0);
  });

  it('refresh->success', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/auth/refresh`)
      .set('Authorization', `Bearer ${bearerRefreshToken}`)
      .expect(200);

    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });

  it('refresh->fail', async () => {
    return request(app.getHttpServer()).post(`/auth/refresh`).expect(401);
  });

  it('check->success', async () => {
    return request(app.getHttpServer())
      .post(`/auth/check`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .expect(200)
      .expect({
        id: existedUserData.id,
        email: existedUserData.email,
        name: existedUserData.name
      });
  });

  it('check->fail', async () => {
    return request(app.getHttpServer()).post(`/auth/check`).expect(401);
  });

  it('get-publishers-list->success', async () => {
    otherUser.subscribers = [];

    const { body: firstResponse } = await request(app.getHttpServer())
      .get(`/auth/get-publishers-list`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .expect(200);

    expect(firstResponse.length).toBe(0);

    await request(app.getHttpServer())
      .patch(`/auth/subscribe`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .send({ authorId: otherUser.id })
      .expect(200);

    const { body: secondResponse } = await request(app.getHttpServer())
      .get(`/auth/get-publishers-list`)
      .set('Authorization', `Bearer ${bearerAccessToken}`)
      .expect(200);

    expect(secondResponse.length).toBe(1);
  });

  it('get-publishers-list->fail', async () => {
    await request(app.getHttpServer()).get(`/auth/get-publishers-list`).expect(401);
  });

  it('get-user-by-id->success', async () => {
    await request(app.getHttpServer()).get(`/auth/${existedUserData.id}`).expect(200);
  });

  it('get-user-by-id->fail', async () => {
    await request(app.getHttpServer()).get(`/auth/failed-id`).expect(400);
    await request(app.getHttpServer()).get(`/auth/664b3110a49385788525269f`).expect(404);
  });

  it('get-user-public-info->success', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/auth/public-info/${existedUserData.id}`).expect(200);

    expect(body.id).toBeDefined();
    expect(body.subscribers).toBeDefined();
    expect(body.registrationDate).toBeDefined();
  });

  it('get-user-public-info->fail', async () => {
    await request(app.getHttpServer())
      .get(`/auth/public-info/failed-id`).expect(400);

    await request(app.getHttpServer())
      .get(`/auth/public-info/664b3110a49385788525269f`).expect(404);
  });

  afterAll(() => {
    app.close();
  });
});
