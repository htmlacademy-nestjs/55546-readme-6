import { Module } from '@nestjs/common';
import { FileStorageConfigModule } from '@project/file-storage-config';
import { FileUploaderModule } from '@project/file-uploader';

@Module({
  imports: [FileUploaderModule, FileStorageConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
