import { ApiProperty } from "@nestjs/swagger";
import { AuthenticationValidateMessage } from "../authentication-module/authentication.constants";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@user.local'
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @IsNotEmpty()
  @IsString()
  public password: string;
}
