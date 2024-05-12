import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommonPostType, Subscriber } from '@project/shared/core';
import { NotifyConfig } from '@project/notify-config';
import { EMAIL_ADD_SUBSCRIBER_SUBJECT } from './mail.constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  @Inject(NotifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof NotifyConfig>

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: './add-subscriber',
      context: {
        user: `${subscriber.name}`,
        email: `${subscriber.email}`,
      }
    })
  }

  public async sendNotifyAboutNewPosts(subscribers: Subscriber[], posts: CommonPostType[]) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscribers.map(subscriber => subscriber.email),
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: './new-posts-appeared',
      context: { posts }
    });
  }
}