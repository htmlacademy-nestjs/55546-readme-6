import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from '@project/shared/helpers';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          username: config.get<string>('file-storage.db.user'),
          password: config.get<string>('file-storage.db.password'),
          host: config.get<string>('file-storage.db.host'),
          port: config.get<string>('file-storage.db.port'),
          authDatabase: config.get<string>('file-storage.db.authBase'),
          databaseName: config.get<string>('file-storage.db.name'),
        })
      }
    },
    inject: [ConfigService]
  }
}
