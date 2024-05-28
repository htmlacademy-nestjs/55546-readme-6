import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '@project/authentication';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) { }

  private static jwtPath: string;

  static setJwtPath(path: string) {
    MockJwtAuthGuard.jwtPath = path;

    return MockJwtAuthGuard;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request & RequestWithUser>();

    if (!req.headers['authorization']) {
      throw new UnauthorizedException();
    }

    const token = req.headers['authorization'].split(' ')[1];

    try {
      req.user = verify(
        token,
        this.configService.get(MockJwtAuthGuard.jwtPath)
      ) as any;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
