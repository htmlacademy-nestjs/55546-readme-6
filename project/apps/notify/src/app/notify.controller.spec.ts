import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyConfig, getMongooseOptions } from '@project/notify-config';
import { EmailSubscriberEntity, EmailSubscriberModule, EmailSubscriberRepository } from '@project/email-subscriber';
import { NewsletterEntity, NewsletterModule, NewsletterRepository } from '@project/notify-newsletter';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import path from 'node:path';
import request from 'supertest';
import { PrismaClientService } from '@project/blog-models';
import { PrismaClient } from '@prisma/client';
import { CheckAuthGuard } from '@project/guards';
import { MockJwtAuthGuard, existedUserData } from '@project/testing';
import { createJWTPayload } from '@project/shared/helpers';
import { sign } from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { MailSubject } from '@project/mail';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting, Subscriber } from '@project/shared/core';
import { blogSeed } from '@project/testing';

describe('Testing NotifyController', () => {
  let app: INestApplication;
  let testPrismaClient: PrismaClient;
  let authToken: string;
  let rabbitClient: AmqpConnection;
  let mailerService: MailerService;
  let notifyConfig: ConfigType<typeof NotifyConfig>;
  let newsletterRepository: NewsletterRepository;

  const subscriber = {
    id: '6648d21ee856d3f24d04b38e',
    name: 'SubscriberName',
    email: 'test-subscriber@mail.ru'
  };

  const subscribers = [subscriber];

  const newSubscriber = {
    name: 'NewSubscriberName',
    email: 'new-test-subscriber@mail.ru'
  };

  const NEW_SUBSCRIBER_ID = '6648d21ee856d3f24d04b381';

  beforeAll(async () => {
    testPrismaClient = new PrismaClient({
      datasourceUrl: 'postgresql://admin:test@localhost:5434/readmy_blog'
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: false,
          load: [NotifyConfig],
          envFilePath: path.resolve(__dirname, '../../../notify/notify.env')
        }),
        MongooseModule.forRootAsync(getMongooseOptions()),
        EmailSubscriberModule,
        NewsletterModule
      ]
    })
      .overrideProvider(PrismaClientService)
      .useValue(testPrismaClient)
      .overrideGuard(CheckAuthGuard)
      .useClass(MockJwtAuthGuard.setJwtPath('JWT_ACCESS_TOKEN_SECRET'))
      .compile();

    app = module.createNestApplication();

    const accessTokenPayload = createJWTPayload(existedUserData);

    await app.init();

    const configService = module.get(ConfigService);
    authToken = sign(accessTokenPayload, configService.get('JWT_ACCESS_TOKEN_SECRET'));

    mailerService = module.get<MailerService>(MailerService);
    notifyConfig = module.get<ConfigType<typeof NotifyConfig>>(NotifyConfig.KEY);
    rabbitClient = module.get<AmqpConnection>(AmqpConnection);
    newsletterRepository = module.get<NewsletterRepository>(NewsletterRepository);
    const emailSubscriberRepository = module.get<EmailSubscriberRepository>(EmailSubscriberRepository);

    jest.spyOn(emailSubscriberRepository, 'findByEmail').mockImplementation(async (email: string) => {
      const user = subscribers.find(user => user.email === email);

      return user ? new EmailSubscriberEntity(user) : null;
    });

    jest.spyOn(emailSubscriberRepository, 'save').mockImplementation(async (subscriber: EmailSubscriberEntity) => {
      subscriber.id = NEW_SUBSCRIBER_ID;
      subscribers.push(subscriber.toPOJO() as any);

      return;
    });

    jest.spyOn(emailSubscriberRepository, 'findAll').mockImplementation(async () => {
      return subscribers.map(subscriber => new EmailSubscriberEntity(subscriber));
    });
  });

  it('getting a last newsletter without jwt token', async () => {
    await request(app.getHttpServer())
      .get('/get-last-newsletter')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('getting a last newsletter', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/get-last-newsletter')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(body.lastMailingDate).toBeDefined();
  });

  it('adding a new subscriber', async () => {
    mailerService.sendMail = jest.fn();

    await rabbitClient.publish<Subscriber>(
      'readmy.notify',
      RabbitRouting.AddSubscriber,
      subscriber
    );

    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      context: { email: subscriber.email, user: subscriber.name },
      from: notifyConfig.mail.from,
      subject: MailSubject.AddSubscriber,
      template: "./add-subscriber",
      to: subscriber.email
    });

    await rabbitClient.publish<Subscriber>(
      'readmy.notify',
      RabbitRouting.AddSubscriber,
      newSubscriber
    );

    expect(mailerService.sendMail).toHaveBeenCalledTimes(2);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      from: notifyConfig.mail.from,
      to: newSubscriber.email,
      subject: MailSubject.AddSubscriber,
      template: "./add-subscriber",
      context: { email: newSubscriber.email, user: newSubscriber.name }
    });
  });

  it('notify about new posts', async () => {
    mailerService.sendMail = jest.fn();
    newsletterRepository.save = jest.fn()
      .mockImplementation(async (entity: NewsletterEntity) => {
        expect(entity.lastMailingDate).toBeDefined();
        return;
      });

    const posts = [blogSeed.linkPost, blogSeed.textPost, blogSeed.videoPost]
      .map(post => ({
        ...post,
        dateCreate: post.dateCreate.toString(),
        dateUpdate: post.dateUpdate.toString()
      }));

    await rabbitClient.publish<any>(
      'readmy.notify.api',
      RabbitRouting.NewPostsAppeared,
      posts
    );

    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      from: notifyConfig.mail.from,
      to: subscribers.map(subscriber => subscriber.email),
      subject: MailSubject.NotifyAboutNewPosts,
      template: "./new-posts-appeared",
      context: { posts }
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
