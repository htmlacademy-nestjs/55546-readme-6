import { IsString, IsNumber, IsOptional, ValidateNested, IsObject, IsNotEmptyObject, IsDefined, validateOrReject } from 'class-validator';
import { EnvValidationMessage } from './file-storage.messages';
import { Type } from 'class-transformer';

export class FileStorageDbConfiguration {
  @IsString({ message: EnvValidationMessage.DbHostRequired })
  host: string;

  @IsNumber({}, { message: EnvValidationMessage.DbPortRequired })
  port: number;

  @IsString({ message: EnvValidationMessage.DbUserRequired })
  user: string;

  @IsString({ message: EnvValidationMessage.DbNameRequired })
  name: string;

  @IsString({ message: EnvValidationMessage.DbPasswordRequired })
  password: string;

  @IsString({ message: EnvValidationMessage.DbAuthBaseRequired })
  authBase: string;
}

export class FileStorageConfiguration {
  @IsString({ message: EnvValidationMessage.EnvironmentRequired })
  environment: string;

  @IsNumber({}, { message: EnvValidationMessage.PortRequired })
  @IsOptional()
  port: number;

  @IsString({ message: EnvValidationMessage.UploadDirectoryRequired })
  uploadDirectory: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FileStorageDbConfiguration)
  db: FileStorageDbConfiguration;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
