import { plainToClass } from "class-transformer";
import { FileStorageConfiguration } from "./file-storage/file-storage.env";
import { DEFAULT_PORT } from "./file-storage/file-storage.const";
import { ConfigType, registerAs } from '@nestjs/config';

export interface FileStorageConfig {
  environment: string;
  port: number;
  uploadDirectory: string;
}

async function getFileStorageConfig(): Promise<FileStorageConfiguration> {
  const config = plainToClass(FileStorageConfiguration, {
    environment: process.env.ENVIRONMENT,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    uploadDirectory: process.env.UPLOAD_DIRECTORY
  });

  await config.validate();

  return config;
}

export default registerAs('file-storage', async (): Promise<ConfigType<typeof getFileStorageConfig>> => {
  return getFileStorageConfig();
})
