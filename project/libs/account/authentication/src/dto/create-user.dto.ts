import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { AuthenticationValidateMessage } from "../authentication-module/authentication.constants";

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@user.local'
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'User name',
    example: 'NewUser'
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'User avatar image path',
    example: '/images/user.png'
  })
  @IsOptional()
  @IsString()
  public avatar?: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @IsString()
  public password: string;
}
