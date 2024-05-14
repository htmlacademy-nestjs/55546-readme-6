import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploaderService } from './file-uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fillDto } from '@project/shared/helpers';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { MongoIdValidationPipe } from '@project/pipes';
import { FindFilesDto } from './dto/find-files.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileResponseMessage, ParamDescription } from './file-uploader.constants';

@ApiTags('files')
@Controller('files')
export class FileUploaderController {
  constructor(private readonly fileUploaderService: FileUploaderService) { }

  @ApiResponse({
    type: [UploadedFileRdo],
    status: HttpStatus.OK,
    description: FileResponseMessage.FoundFileList
  })
  @ApiBody({ type: FindFilesDto })
  @HttpCode(HttpStatus.OK)
  @Post('/get-files-by-id')
  public async getFilesById(@Body() { filesIds }: FindFilesDto) {
    const filesEntities = await this.fileUploaderService.getFilesById(filesIds);
    return filesEntities.map(entity => fillDto(UploadedFileRdo, { ...entity.toPOJO() }));
  }

  @ApiResponse({
    type: UploadedFileRdo,
    status: HttpStatus.CREATED,
    description: FileResponseMessage.FileCreated
  })
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.fileUploaderService.saveFile(file);
    return fillDto(UploadedFileRdo, { ...fileEntity.toPOJO() });
  }

  @ApiResponse({
    type: UploadedFileRdo,
    status: HttpStatus.OK,
    description: FileResponseMessage.FileFound
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: FileResponseMessage.FileNotFound
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: FileResponseMessage.BadMongoIdError
  })
  @ApiParam({ name: "fileId", required: true, description: ParamDescription.FileId })
  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.fileUploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, { ...existFile.toPOJO() });
  }
}
