import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { AuthenticationValidateMessage, NameLength, PasswordLength } from "../authentication-module/authentication.constants";

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@user.local'
  })
  @IsNotEmpty()
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'User name',
    example: 'NewUser'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(NameLength.Min)
  @MaxLength(NameLength.Max)
  public name: string;

  @ApiProperty({
    description: 'User avatar entity id',
    example: '660eb9f25dac3408417b2da9'
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  public avatarId?: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(PasswordLength.Min)
  @MaxLength(PasswordLength.Max)
  public password: string;
}
