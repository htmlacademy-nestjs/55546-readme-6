import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { BlogController } from './blog.controller';
import { ApiConfigModule, HttpClient } from '@project/api-config';
import { CheckAuthGuard } from '@project/guards';
import { BlogCommentController } from './comments.controller';
import { NotifyController } from './notify.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMQOptions } from '@project/shared/helpers';

@Module({
  imports: [
    ApiConfigModule,
    RabbitMQModule.forRootAsync(
      RabbitMQModule,
      getRabbitMQOptions('rabbit')
    ),
    HttpModule.register({
      timeout: HttpClient.Timeout,
      maxRedirects: HttpClient.MaxRedirects,
    }),
  ],
  controllers: [UsersController, BlogController, BlogCommentController, NotifyController],
  providers: [CheckAuthGuard],
})
export class AppModule { }
