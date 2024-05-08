import 'multer';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, ParseFilePipeBuilder, Post, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';

import { AVATAR_AVAILABLE_TYPES, AVATAR_MAX_SIZE, ChangeUserPasswordDto, CreateUserDto, LoginUserDto } from '@project/authentication';
import { ApplicationServiceURL } from '@project/api-config';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from '@project/shared/helpers';
import { CheckAuthGuard } from '@project/guards';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService
  ) { }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  public async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      (new ParseFilePipeBuilder())
        .addMaxSizeValidator({ maxSize: AVATAR_MAX_SIZE })
        .addFileTypeValidator({ fileType: AVATAR_AVAILABLE_TYPES })
        .build({ fileIsRequired: false })
    ) avatar?: Express.Multer.File
  ) {
    const id = avatar ? (await saveFile(this.httpService, avatar)).id : undefined;

    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/register`,
      { ...createUserDto, avatarId: id });

    return data;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/login`, loginUserDto);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('change-password')
  public async changePassword(@Req() request: Request, @Body() changeUserPasswordDto: ChangeUserPasswordDto) {
    this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/change-password`, changeUserPasswordDto, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    });
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/refresh`, null, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });

    return data;
  }
}
