import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class FindFilesDto {
  @IsNotEmpty()
  @IsString({ each: true })
  @IsMongoId({ each: true })
  @IsArray()
  public filesIds: string[];
}
