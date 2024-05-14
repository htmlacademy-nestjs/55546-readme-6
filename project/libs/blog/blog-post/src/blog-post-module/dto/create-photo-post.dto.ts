import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class CreatePhotoPostDto extends CreatePostDto {
  @ApiProperty({
    description: 'Post photo image id',
    example: '661022d3615ce5c3c722054f'
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  public photoId: string;
}
