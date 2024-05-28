import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '@project/authentication';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { existedUserData } from '../account/testing-accounts.users';
import { BlogUserEntity } from '@project/blog-user';
import { verify } from 'jsonwebtoken';

@Injectable()
export class MockJwtRefreshGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request & RequestWithUser>();

    if (!req.headers['authorization']) {
      throw new UnauthorizedException();
    }

    const token = req.headers['authorization'].split(' ')[1];

    try {
      req.user = verify(
        token,
        this.configService.get<string>('jwt.refreshTokenSecret'),
      ) as any;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
