import { IsString, IsNotEmpty, validateOrReject } from 'class-validator';

export class JWTConfiguration {
  @IsString()
  @IsNotEmpty()
  accessTokenSecret: string;

  @IsString()
  @IsNotEmpty()
  accessTokenExpiresIn: string;

  @IsString()
  @IsNotEmpty()
  refreshTokenSecret: string;

  @IsString()
  @IsNotEmpty()
  refreshTokenExpiresIn: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
