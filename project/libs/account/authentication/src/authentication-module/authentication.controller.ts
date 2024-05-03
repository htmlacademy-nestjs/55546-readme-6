import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationResponseMessage } from './authentication.constants';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { UserRdo } from '../rdo/user.rdo';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared/helpers';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NotifyService } from '@project/account-notify';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestWithUser } from './request-with-user.interface';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) { }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthenticationResponseMessage.UserCreated
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationResponseMessage.UserExist
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);

    const { id, email, name } = newUser;
    await this.notifyService.registerSubscriber({ id, email, name });

    return newUser.toPOJO();
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
}
