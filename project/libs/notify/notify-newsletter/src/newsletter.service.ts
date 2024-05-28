import { Injectable } from '@nestjs/common';
import { NewsletterRepository } from './newsletter.repository';
import { CommonPostType } from '@project/shared/core';
import { EmailSubscriberRepository } from '@project/email-subscriber';
import { MailService } from '@project/mail';
import { NewsletterEntity } from './newsletter.entity';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly newsletterRepository: NewsletterRepository,
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly mailService: MailService,
  ) { }

  public async getLastNewsletter() {
    return await this.newsletterRepository.getLastNewsletter();
  }

  public async sendNotifyNewSubscriber(posts: CommonPostType[]) {
    const subscribers = await this.emailSubscriberRepository.findAll();

    if (posts.length === 0 || subscribers.length === 0) {
      return;
    }

    await this.mailService.sendNotifyAboutNewPosts(subscribers, posts);
    await this.newsletterRepository.save(
      new NewsletterEntity({ lastMailingDate: new Date() })
    );
  }
}
