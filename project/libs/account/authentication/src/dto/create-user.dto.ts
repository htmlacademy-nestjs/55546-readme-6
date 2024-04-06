import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@user.local'
  })
  public email: string;

  @ApiProperty({
    description: 'User name',
    example: 'NewUser'
  })
  public name: string;

  @ApiProperty({
    description: 'User avatar image path',
    example: '/images/user.png'
  })
  public avatar?: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  public password: string;
}
