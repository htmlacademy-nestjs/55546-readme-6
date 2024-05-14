import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TokenPayload } from '@project/shared/core';

export class UserPayloadRdo implements TokenPayload {
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
    description: 'User email',
    example: 'user@user.local'
  })
  @Expose()
  public name: string;
}

