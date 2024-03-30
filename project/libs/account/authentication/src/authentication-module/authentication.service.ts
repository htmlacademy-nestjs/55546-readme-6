import { Injectable } from '@nestjs/common';
import { BlogUserRepository } from '@project/blog-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { AUTH_USER_EXISTS } from './authentication.constants';
import { BlogUserEntity } from '@project/blog-user';

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
      throw new Error(AUTH_USER_EXISTS);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    this.blogUserRepository.save(userEntity);

    return userEntity;
  }
}
