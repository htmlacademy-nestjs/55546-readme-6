import { IsString, IsNumber, IsOptional, validate, ValidateNested, IsObject, IsNotEmptyObject, IsDefined } from 'class-validator';
import { handleClassValidatorError } from '@project/shared/helpers';
import { EnvValidationMessage } from './notify.messages';
import { Type } from 'class-transformer';

export class NotifyDbConfiguration {
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

export class NotifyRabbitConfiguration {
  @IsString({ message: EnvValidationMessage.RabbitHostRequired })
  host: string;

  @IsNumber({}, { message: EnvValidationMessage.RabbitPortRequired })
  port: number;

  @IsString({ message: EnvValidationMessage.RabbitUserRequired })
  user: string;

  @IsString({ message: EnvValidationMessage.RabbitQueueRequired })
  queue: string;

  @IsString({ message: EnvValidationMessage.RabbitPasswordRequired })
  password: string;

  @IsString({ message: EnvValidationMessage.RabbitExchangeRequired })
  exchange: string;
}

export class NotifyConfiguration {
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
  @Type(() => NotifyDbConfiguration)
  db: NotifyDbConfiguration;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => NotifyRabbitConfiguration)
  reabbit: NotifyRabbitConfiguration;

  public async validate(): Promise<void> {
    handleClassValidatorError(await validate(this) as any);
  }
}
