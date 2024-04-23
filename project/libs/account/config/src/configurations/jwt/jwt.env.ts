import { validate, IsString, IsNotEmpty } from 'class-validator';
import { handleClassValidatorError } from '@project/shared/helpers';

export class JWTConfiguration {
  @IsString()
  @IsNotEmpty()
  accessTokenSecret: string;

  @IsString()
  @IsNotEmpty()
  accessTokenExpiresIn: string;

  public async validate(): Promise<void> {
    handleClassValidatorError(await validate(this) as any);
  }
}
