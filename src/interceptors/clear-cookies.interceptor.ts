import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export function ClearCookies(cookieKeys: string[]) {
  return UseInterceptors(new ClearCookieInterceptor(cookieKeys));
}

@Injectable()
export class ClearCookieInterceptor implements NestInterceptor {
  private _cookieKeysToRemove: string[];
  constructor(cookieKeysToRemove: string[]) {
    this._cookieKeysToRemove = cookieKeysToRemove;
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data: Record<string, any>) => {
        for (const key of this._cookieKeysToRemove) {
          response.clearCookie(key, { httpOnly: true });
        }
        return data;
      }),
    );
  }
}
