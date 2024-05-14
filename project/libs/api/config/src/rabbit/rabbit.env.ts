import { IsString, IsNumber, validateOrReject } from 'class-validator';
import { EnvValidationMessage } from './rabbit.messages';

export class RabbitConfiguration {
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

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}

