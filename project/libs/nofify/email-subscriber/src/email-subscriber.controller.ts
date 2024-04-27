import { Controller, Get } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { RabbitRouting } from '@project/shared/core';
import { MailService } from './mail-module/mail.service';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) { }

  @RabbitSubscribe({
    exchange: 'readmy.notify',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readmy.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @Get('send-mail')
  public async notify() {
    this.mailService.sendNotifyNewSubscriber({ id: '_', name: 'User', email: 'u@mail.ru' });
  }
}