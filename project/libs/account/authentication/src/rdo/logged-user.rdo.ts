import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @ApiProperty({
    description: 'The uniq user ID',
    example: '660eb9f25dac3408417b2da9'
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@user.local'
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'User access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  })
  @Expose()
  public accessToken: string;
}
