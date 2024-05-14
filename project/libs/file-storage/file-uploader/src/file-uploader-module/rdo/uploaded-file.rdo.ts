import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadedFileRdo {
  @ApiProperty({
    description: 'The uniq file ID',
    example: '663f57ceb6973244113ad09e'
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'photo_2024-04-25_15-01-49.jpg'
  })
  @Expose()
  public originalName: string;

  @ApiProperty({
    description: 'Hast file name',
    example: 'ae4430d7-055b-4086-8874-4ac0a818872c.jpeg'
  })
  @Expose()
  public hashName: string;

  @ApiProperty({
    description: 'File storage directory',
    example: '2024/05'
  })
  @Expose()
  public subDirectory: string;

  @ApiProperty({
    description: 'File type',
    example: 'image/jpeg'
  })
  @Expose()
  public mimetype: string;

  @ApiProperty({
    description: 'File size',
    example: 298926,
  })
  @Expose()
  public size: number;

  @ApiProperty({
    description: 'Full path to the file',
    example: '/home/user/www/55546-readme-6/project/apps/file-storage/uploads/2024/05/ae4430d7-055b-4086-8874-4ac0a818872c.jpeg',
  })
  @Expose()
  public path: string;
}
