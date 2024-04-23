import { ApiProperty } from "@nestjs/swagger";
import { AuthenticationValidateMessage } from "../authentication-module/authentication.constants";
import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@user.local'
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @IsString()
  public password: string;
}
