import { IsNotEmpty, validateOrReject } from 'class-validator';
import { IsString, IsNumber, IsIn } from 'class-validator';
import { EnvValidationMessage } from './app.messages';
import { ENVIRONMENTS, EnvironmentType } from './app.const';

export default class AppConfig {
  @IsNotEmpty()
  @IsString({ message: EnvValidationMessage.AppEnvironmentRequired })
  @IsIn(ENVIRONMENTS, { message: EnvValidationMessage.AppEnvironmentWrongType })
  public environment: EnvironmentType;

  @IsNotEmpty()
  @IsNumber({}, { message: EnvValidationMessage.AppPortRequired })
  public port: number;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
