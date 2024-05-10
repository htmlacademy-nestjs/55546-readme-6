import { Controller, Get, UseGuards } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CommonPostType, RabbitRouting } from '@project/shared/core';
import { NewsletterService } from './newsletter.service';
import { CheckAuthGuard } from '@project/guards';

@Controller()
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
  ) { }

  @RabbitSubscribe({
    exchange: 'readmy.notify.api',
    routingKey: RabbitRouting.NewPostsAppeared,
    queue: 'readmy.notify.api',
  })
  public async notifyAboutNewPosts(posts: CommonPostType[]) {
    this.newsletterService.sendNotifyNewSubscriber(posts);
  }

  @UseGuards(CheckAuthGuard)
  @Get('/get-last-newsletter')
  public async getLastNewsletterDate() {
    return this.newsletterService.getLastNewsletter();
  }
}
