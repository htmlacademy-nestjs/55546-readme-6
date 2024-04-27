import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileStorageConfigModule, getMongooseOptions } from '@project/file-storage-config';
import { FileUploaderModule } from '@project/file-uploader';

@Module({
  imports: [
    FileUploaderModule,
    FileStorageConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions())
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
