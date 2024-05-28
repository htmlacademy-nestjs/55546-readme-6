import { CallHandler, ExecutionContext, Inject, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { HttpService } from '@nestjs/axios';

export class InjectAxiosAuthorization implements NestInterceptor {
  constructor(@Inject(HttpService) private httpService: HttpService) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    this.httpService.axiosRef.interceptors.request.use(config => {
      config.headers['Authorization'] = request.headers['authorization'];
      config.headers['X-Request-Id'] = request.headers['X-Request-Id'];

      return config;
    });

    return next.handle();
  }

}
