import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { Observable } from 'rxjs';

/**
 * The sequence of middleware, guard, interceptor is:
 * Request
 *   |
 * Middlewares
 *   |
 * Guards
 *   |
 *   | <--------------------|
 *   |                      |
 *  Request Handler    Interceptor
 *   |                      |
 *   | <--------------------|
 *   |
 *  Response
 */

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private _userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.cookies?.['id'] || undefined;
    if (userId && typeof userId === 'string') {
      const currentUser = await this._userService.findOneById(parseInt(userId));
      request.currentUser = currentUser;
    }

    return next.handle();
  }
}
