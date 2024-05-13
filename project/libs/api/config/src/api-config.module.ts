import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import rabbitConfig from './rabbit.config';

const ENV_FILE_PATH = 'apps/api/api.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      load: [rabbitConfig],
      envFilePath: ENV_FILE_PATH
    })
  ]
})
export class ApiConfigModule { }
