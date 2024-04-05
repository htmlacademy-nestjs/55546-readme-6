import { validateOrReject, validate } from 'class-validator';
import { IsString, IsNumber, IsIn, IsEnum } from 'class-validator';
import { EnvValidationMessage } from './app.messages';
import { ENVIRONMENTS, EnvironmentType } from './app.const';

export default class AppConfig {
  @IsString({ message: EnvValidationMessage.AppEnvironmentRequired })
  @IsIn(ENVIRONMENTS, { message: EnvValidationMessage.AppEnvironmentWrongType })
  public environment: EnvironmentType;

  @IsNumber({}, { message: EnvValidationMessage.AppPortRequired })
  public port: number;

  public async validate(): Promise<void> {
    const [firstError] = await validate(this);
    if (firstError) {
      throw new Error(
        firstError.property + ' - ' +
        firstError.value + ': ' + JSON.stringify(firstError.constraints));
    }
  }
}
