import 'multer';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AVATAR_AVAILABLE_TYPES, AVATAR_MAX_SIZE, ChangeUserPasswordDto, CreateSubscribeDto, CreateUserDto, LoginUserDto } from '@project/authentication';
import { ApplicationServiceURL } from '@project/api-config';
import { AxiosExceptionFilter } from '@project/filters';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from '@project/guards';
import { InjectAxiosAuthorization } from '@project/interceptors';
import { UsersService } from './services/users.service';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
@UseInterceptors(InjectAxiosAuthorization)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
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
    return this.usersService.register(createUserDto, avatar);
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/login`, loginUserDto);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Patch('change-password')
  public async changePassword(@Body() changeUserPasswordDto: ChangeUserPasswordDto) {
    await this.httpService.axiosRef.patch(`${ApplicationServiceURL.Users}/change-password`, changeUserPasswordDto);
  }

  @Post('refresh')
  public async refreshToken() {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/refresh`);
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Patch('subscribe')
  public async subscribe(@Body() dto: CreateSubscribeDto) {
    const { data } = await this.httpService.axiosRef.patch(`${ApplicationServiceURL.Users}/subscribe`, dto);
    return data;
  }

  @Get(':userId')
  public async getUserInfo(@Param('userId') userId: string) {
    return this.usersService.getUserInfo(userId);
  }
}
