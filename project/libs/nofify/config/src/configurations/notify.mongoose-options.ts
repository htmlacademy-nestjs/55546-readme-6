import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          username: config.get<string>('notify.db.user'),
          password: config.get<string>('notify.db.password'),
          host: config.get<string>('notify.db.host'),
          port: config.get<string>('notify.db.port'),
          authDatabase: config.get<string>('notify.db.authBase'),
          databaseName: config.get<string>('notify.db.name'),
        })
      };
    },
    inject: [ConfigService]
  }
}
