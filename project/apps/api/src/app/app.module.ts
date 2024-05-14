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
import { UsersService } from './services/users.service';
import { BlogService } from './services/blog.service';

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
  providers: [UsersService, BlogService, CheckAuthGuard],
})
export class AppModule { }
