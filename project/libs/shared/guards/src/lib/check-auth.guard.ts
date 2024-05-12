import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ApplicationServiceURL } from '@project/api-config';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/check`, {}, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    });

    request['user'] = data;

    return true;
  }
}

