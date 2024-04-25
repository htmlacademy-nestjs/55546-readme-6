import { IsString, IsNumber, IsOptional, validate } from 'class-validator';
import { handleClassValidatorError } from '@project/shared/helpers';
import { EnvValidationMessage } from './file-storage.messages';

export class FileStorageConfiguration {
  @IsString({ message: EnvValidationMessage.EnvironmentRequired })
  environment: string;

  @IsNumber({}, { message: EnvValidationMessage.PortRequired })
  @IsOptional()
  port: number;

  @IsString({ message: EnvValidationMessage.UploadDirectoryRequired })
  uploadDirectory: string;

  public async validate(): Promise<void> {
    handleClassValidatorError(await validate(this) as any);
  }
}
