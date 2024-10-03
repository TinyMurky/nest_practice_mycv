/**
 * Info: (20241003 - Murky)
 * https://docs.nestjs.com/guards
 * Guards are executed after all middleware, but before any interceptor or pipe.
 * 單純回傳True or False 來判定能不能pass
 */

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.cookies?.['id'] || undefined;

    return !!userId;
  }
}
