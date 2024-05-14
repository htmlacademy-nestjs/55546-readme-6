import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class TokenRdo {
  @ApiProperty({
    description: 'User access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    description: 'User refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  })
  @Expose()
  public refreshToken: string;
}
