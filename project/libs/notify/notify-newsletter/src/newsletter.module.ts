import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMQOptions } from '@project/shared/helpers';
import { NewsletterModel, NewsletterSchema } from './newsletter.model';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterRepository } from './newsletter.repository';
import { NewsletterFactory } from './newsletter.factory';
import { MailModule } from '@project/mail';
import { CheckAuthGuard } from '@project/guards';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@project/api-config';
import { EmailSubscriberModule } from '@project/email-subscriber';

@Module({
  imports: [
    HttpModule.register({
      timeout: HttpClient.Timeout,
      maxRedirects: HttpClient.MaxRedirects,
    }),
    MongooseModule.forFeature([
      { name: NewsletterModel.name, schema: NewsletterSchema }
    ]),
    RabbitMQModule.forRootAsync(
      RabbitMQModule,
      getRabbitMQOptions('notify.rabbit')
    ),
    EmailSubscriberModule,
    MailModule
  ],
  controllers: [NewsletterController],
  providers: [
    NewsletterService,
    NewsletterRepository,
    NewsletterFactory,
    CheckAuthGuard
  ]
})
export class NewsletterModule { }
