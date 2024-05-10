import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import rabbitConfig from './rabbit.config';

const ENV_USERS_FILE_PATH = 'apps/api/api.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [rabbitConfig],
      envFilePath: ENV_USERS_FILE_PATH
    })
  ]
})
export class ApiConfigModule { }
