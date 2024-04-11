import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BlogUserRepository } from '@project/blog-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthenticationResponseMessage } from './authentication.constants';
import { BlogUserEntity } from '@project/blog-user';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly blogUserRepository: BlogUserRepository) { }

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
}
