import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';

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

// Use below stuff so that typescript will not complain
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private _userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.cookies?.['id'] || undefined;
    if (userId && typeof userId === 'string') {
      const currentUser = await this._userService.findOneById(parseInt(userId));

      // 需要declare 讓ts知道 req 裡面有我們自己加的currentUser
      req.currentUser = currentUser;
    }

    next();
  }
}
