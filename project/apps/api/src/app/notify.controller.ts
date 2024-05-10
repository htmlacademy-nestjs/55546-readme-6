import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, Param, Req, UseFilters, UseGuards, } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { rabbitConfig } from '@project/account-config';
import { ApplicationServiceURL } from '@project/api-config';
import { CheckAuthGuard } from '@project/guards';
import { RabbitRouting } from '@project/shared/core';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

@Controller('notify')
@UseFilters(AxiosExceptionFilter)
export class NotifyController {
  constructor(
    private readonly httpService: HttpService,
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbiOptions: ConfigType<typeof rabbitConfig>,
  ) { }

  @UseGuards(CheckAuthGuard)
  @Get('/new-posts-appeared')
  public async newPostsAppeared(@Req() req: Request) {
    try {
      const { data: lastNewsletter } = await this.httpService
        .axiosRef.get(`${ApplicationServiceURL.Notify}/get-last-newsletter`, {
          headers: {
            'Authorization': req.headers['authorization']
          }
        });

      const { data: posts } = await this.httpService
        .axiosRef.get(`${ApplicationServiceURL.Blog}/find-after-date`, {
          params: { date: lastNewsletter.lastMailingDate },
          headers: {
            'Authorization': req.headers['authorization']
          }
        });

      this.rabbitClient.publish<any>(
        this.rabbiOptions.exchange,
        RabbitRouting.NewPostsAppeared,
        posts
      );
    } catch (err) {
      return err.response.data;
    }
  }
}
