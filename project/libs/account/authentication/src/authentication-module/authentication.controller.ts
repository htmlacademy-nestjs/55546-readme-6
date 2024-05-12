import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationResponseMessage, ParamDescription } from './authentication.constants';
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
  @ApiBody({ type: CreateUserDto })
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
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: AuthenticationResponseMessage.TokenCreatedError
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() { user }: RequestWithUser) {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken })
  }

  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.LoggedError
  })
  @ApiBody({ type: ChangeUserPasswordDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  public async changePassword(
    @Req() { user: { id } }: RequestWithUser,
    @Body() { oldPassword, newPassword }: ChangeUserPasswordDto
  ) {
    return this.authService.changeUserPassword(id, oldPassword, newPassword);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound
  })
  @ApiBody({ type: CreateSubscribeDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('subscribe')
  public async subscribe(
    @Req() { user }: RequestWithUser,
    @Body() dto: CreateSubscribeDto
  ) {
    const userData = await this.authService.subscribe(user.id, dto.authorId);
    return fillDto(UserRdo, {
      ...userData.toPOJO(),
      avatar: await this.authService.getAvatar(userData.avatarId)
    });
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthenticationResponseMessage.BadMongoIdError
  })
  @ApiParam({ name: "id", required: true, description: ParamDescription.UserId })
  @Get(':id')
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existedUser = await this.authService.getUserById(id);

    return fillDto(UserRdo, {
      ...existedUser.toPOJO(),
      avatar: await this.authService.getAvatar(existedUser.avatarId)
    });
  }

  @ApiResponse({
    type: [UserRdo],
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.GettingUsersById
  })
  @Post('get-users-by-id')
  public async getUserList(@Body('usersIds') usersIds: string[]) {
    const users = await this.authService.getUsersByListId(usersIds);

    return users.map(user => fillDto(UserRdo, { ...user.toPOJO() }));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.GetNewTokens
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.JwtAuthError
  })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.JwtAuthSuccess
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.JwtAuthError
  })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  @HttpCode(HttpStatus.OK)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
