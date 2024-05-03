import { ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BlogUserRepository } from '@project/blog-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthenticationResponseMessage } from './authentication.constants';
import { BlogUserEntity } from '@project/blog-user';
import { LoginUserDto } from '../dto/login-user.dto';
import { Token, TokenPayload, User } from '@project/shared/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@project/account-config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) { }

  public async register(dto: CreateUserDto) {
    const { email, password, avatar, name } = dto;

    const blogUser = {
      email,
      name,
      avatar,
      passwordHash: '',
      registrationDate: null
    }

    const existUser = await this.blogUserRepository.findByEmail(email);
    if (existUser) {
      throw new ConflictException(AuthenticationResponseMessage.UserExist);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    this.blogUserRepository.save(userEntity);

    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(AuthenticationResponseMessage.UserNotFound);
    }

    if (!await existUser.comparePassword(password)) {
      throw new UnauthorizedException(AuthenticationResponseMessage.UserPasswordWrong);
    }

    return existUser;
  }

  public async getUserById(id: string) {
    return this.blogUserRepository.findById(id);
  }

  public async createUserToken(user: User): Promise<Token> {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (err) {
      this.logger.error('[Token generation error]: ' + err.message);
      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserByEmail(email: string) {
    const existUser = await this.blogUserRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existUser;
  }
}
