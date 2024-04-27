import { Module } from '@nestjs/common';
import { FileUploaderService } from './file-uploader.service';
import { FileUploaderController } from './file-uploader.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { FileUploaderRepository } from './file-uploader.repository';
import { FileUploaderFactory } from './file-uploader.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel, FileSchema } from './file.model';

const SERVE_ROOT = '/static';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.get('file-storage.uploadDirectory');

        return [{
          rootPath,
          serveRoot: SERVE_ROOT,
          serveStaticOptions: {
            fallthrough: true,
            etag: true
          }
        }];
      }
    }),
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema }
    ])
  ],
  providers: [FileUploaderService, FileUploaderRepository, FileUploaderFactory],
  controllers: [FileUploaderController],
})
export class FileUploaderModule { }
