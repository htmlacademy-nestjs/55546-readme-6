import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationResponseMessage } from './authentication.constants';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { UserRdo } from '../rdo/user.rdo';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared/helpers';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestWithUser } from './request-with-user.interface';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithTokenPayload } from './request-with-token-payload.interface';
import IsGuestGuard from '../guards/is-guest.guard';
import { ChangeUserPasswordDto } from '../dto/change-user-password.dto';
import { CreateSubscriberDto } from 'libs/account/notify/src/dto/create-subscriber.dto';
import { CreateSubscribeDto } from '../dto/create-subscribe.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
  ) { }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthenticationResponseMessage.UserCreated
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationResponseMessage.UserExist
  })
  @UseGuards(IsGuestGuard)
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.LoggedSuccess
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.LoggedError
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() { user }: RequestWithUser) {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken })
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  public async changePassword(@Req() { user: { id } }: RequestWithUser, @Body() changeUserPasswordDto: ChangeUserPasswordDto) {
    return this.authService.changeUserPassword(id, changeUserPasswordDto.oldPassword, changeUserPasswordDto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('subscribe')
  public async subscribe(@Req() { user }: RequestWithUser, @Body() dto: CreateSubscribeDto) {
    console.log('user', user)
    return this.authService.subscribe(user.id, dto.authorId);
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.UserFound
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound
  })
  @Get(':id')
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existedUser = await this.authService.getUserById(id);

    const { passwordHash, ...data } = existedUser.toPOJO();

    return data;
  }

  @Post('get-users-by-id')
  public async getUserList(@Body('usersListId') usersListId: string[]) {
    const users = await this.authService.getUsersByListId(usersListId);

    return users.map(user => {
      const { passwordHash, ...data } = user.toPOJO();

      return data;
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.JwtAuthSuccess
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.JwtAuthError
  })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.GetNewTokens
  })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  @HttpCode(HttpStatus.OK)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
