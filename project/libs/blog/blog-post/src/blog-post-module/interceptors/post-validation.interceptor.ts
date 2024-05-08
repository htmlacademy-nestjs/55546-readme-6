import * as crypto from 'crypto';
import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UploadedFile
} from '@nestjs/common';

@Injectable()
export class PostValidatoinInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler, @UploadedFile() photo?: any): Observable<any> {
    console.log('photo', photo)
    // const requestId = crypto.randomUUID();
    //
    // const request = context.switchToHttp().getRequest<Request>();
    // request.headers['X-Request-Id'] = requestId;
    //
    // Logger.log(`[${request.method}: ${request.url}]: RequestID is ${requestId}`)
    return next.handle();
  }
}
