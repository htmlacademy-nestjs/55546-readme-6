import { IsString, IsNumber, IsOptional, ValidateNested, IsObject, IsNotEmptyObject, IsDefined, validateOrReject } from 'class-validator';
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

export class NotifyMailConfiguration {
  @IsString({ message: EnvValidationMessage.MailHostRequired })
  host: string;

  @IsNumber({}, { message: EnvValidationMessage.MailPortRequired })
  port: number;

  @IsString({ message: EnvValidationMessage.MailUserRequired })
  user: string;

  @IsString({ message: EnvValidationMessage.MailFromRequired })
  from: string;

  @IsString({ message: EnvValidationMessage.MailPasswordRequired })
  password: string;
}

export class NotifyConfiguration {
  @IsString({ message: EnvValidationMessage.EnvironmentRequired })
  environment: string;

  @IsNumber({}, { message: EnvValidationMessage.PortRequired })
  @IsOptional()
  port: number;

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
  rabbit: NotifyRabbitConfiguration;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => NotifyMailConfiguration)
  mail: NotifyMailConfiguration;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
