import { ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BlogUserRepository } from '@project/blog-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthenticationResponseMessage } from './authentication.constants';
import { BlogUserEntity } from '@project/blog-user';
import { LoginUserDto } from '../dto/login-user.dto';
import { STATIC_DIR, Token, User } from '@project/shared/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@project/account-config';
import { ConfigType } from '@nestjs/config';
import { createJWTPayload } from '@project/shared/helpers';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';
import crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ApplicationServiceURL } from '@project/api-config';
import { NotifyService } from '@project/account-notify';
import { Types } from 'mongoose';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly httpService: HttpService,
    private readonly notifyService: NotifyService,
  ) { }

  public async getAvatar(fileId: string) {
    const { data } = await this.httpService.axiosRef.get(`${ApplicationServiceURL.FilesStorage}/${fileId}`);

    return data;
  }

  private async getAvatarPath(fileId: string): Promise<string> {
    if (!fileId) {
      return '';
    }

    const data = await this.getAvatar(fileId);

    return `${STATIC_DIR}/${data.subDirectory}/${data.hashName}`;
  }

  public async register(dto: CreateUserDto) {
    const { email, password, avatarId, name } = dto;

    const blogUser = {
      email,
      name,
      avatarId,
      passwordHash: '',
      registrationDate: null,
      subscribers: []
    }

    const existUser = await this.blogUserRepository.findByEmail(email);
    if (existUser) {
      throw new ConflictException(AuthenticationResponseMessage.UserExist);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    this.blogUserRepository.save(userEntity);

    await this.notifyService.registerSubscriber({
      id: userEntity.id,
      email: userEntity.email,
      name: userEntity.name
    });

    return { ...userEntity.toPOJO(), avatar: await this.getAvatarPath(userEntity.avatarId) };
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
    const existUser = await this.blogUserRepository.findById(id);
    if (!existUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return existUser;
  }

  public async getUsersByListId(usersListId: string[] = []) {
    return this.blogUserRepository.findListById(
      usersListId.filter(id => Types.ObjectId.isValid(id)));
  }

  public async createUserToken(user: User): Promise<Token> {

    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (err) {
      this.logger.error('[Token generation error]: ' + err.message);
      throw new HttpException(AuthenticationResponseMessage.TokenCreatedError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserByEmail(email: string) {
    const existUser = await this.blogUserRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existUser;
  }

  public async changeUserPassword(userId: string, oldPassword: string, newPassword: string) {
    const existUser = await this.blogUserRepository.findById(userId);
    if (!await existUser.comparePassword(oldPassword)) {
      throw new UnauthorizedException(AuthenticationResponseMessage.UserPasswordWrong);
    }

    const userEntity = await new BlogUserEntity(existUser).setPassword(newPassword);

    this.blogUserRepository.update(userEntity);
  }

  public async subscribe(subscriberId: string, authorId: string) {
    const subscriber = await this.blogUserRepository.findById(subscriberId);
    if (!subscriber) {
      throw new NotFoundException(`Subscriber user with id ${subscriberId} not found`);
    }

    const author = await this.blogUserRepository.findById(authorId);
    if (!author) {
      throw new NotFoundException(`Author user with id ${authorId} not found`);
    }

    await this.blogUserRepository.update(author.updateSubscribers(subscriberId));

    return author;
  }

  public async getPublishersList(subscriberId: string) {
    return await this.blogUserRepository.findPublishersList(subscriberId);
  }
}
