import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export default class IsGuestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    return !request.headers['authorization'];
  }
}
