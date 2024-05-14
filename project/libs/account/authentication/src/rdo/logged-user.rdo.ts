import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TokenRdo } from './token.rdo';

export class LoggedUserRdo extends TokenRdo {
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
}
