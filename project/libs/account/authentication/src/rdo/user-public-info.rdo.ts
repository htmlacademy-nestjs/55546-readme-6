import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserPublicInfoRdo {
  @ApiProperty({
    description: 'The uniq user ID',
    example: '660eb9f25dac3408417b2da9'
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Number of user subscriber',
    example: 37
  })
  @Expose()
  public subscribers: number;

  @ApiProperty({
    description: 'Number of user posts',
    example: 10
  })
  @Expose()
  public postsCount: number;

  @ApiProperty({
    description: 'User registration date (ISO format)',
    example: '2024-04-04'
  })
  @Expose()
  public registrationDate: string;
}
