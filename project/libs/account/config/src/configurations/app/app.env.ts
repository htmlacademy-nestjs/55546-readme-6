import { handleClassValidatorError } from '@project/shared/helpers';
import { validate } from 'class-validator';
import { IsString, IsNumber, IsIn } from 'class-validator';
import { EnvValidationMessage } from './app.messages';
import { ENVIRONMENTS, EnvironmentType } from './app.const';

export default class AppConfig {
  @IsString({ message: EnvValidationMessage.AppEnvironmentRequired })
  @IsIn(ENVIRONMENTS, { message: EnvValidationMessage.AppEnvironmentWrongType })
  public environment: EnvironmentType;

  @IsNumber({}, { message: EnvValidationMessage.AppPortRequired })
  public port: number;

  public async validate(): Promise<void> {
    handleClassValidatorError(await validate(this) as any);
  }
}
