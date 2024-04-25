import { plainToClass } from "class-transformer";
import { FileStorageConfiguration } from "./file-storage/file-storage.env";
import { DEFAULT_PORT, ENVIRONMENTS } from "./file-storage/file-storage.const";
import { ConfigType, registerAs } from '@nestjs/config';

type Environment = typeof ENVIRONMENTS[number];

export interface FileStorageConfig {
  environment: string;
  port: number;
  uploadDirectory: string;
}

async function getFileStorageConfig(): Promise<FileStorageConfiguration> {
  const config = plainToClass(FileStorageConfiguration, {
    environment: process.env.NODE_ENV as Environment,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH
  });

  await config.validate();

  return config;
}

export default registerAs('file-storage', async (): Promise<ConfigType<typeof getFileStorageConfig>> => {
  return getFileStorageConfig();
})
