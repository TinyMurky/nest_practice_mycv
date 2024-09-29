import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data: Record<string, any>) => {
        console.log('Record data', data);
        for (const key of Object.keys(data)) {
          response.cookie(key, data[key], { httpOnly: true });
        }
        return data;
      }),
    );
  }
}
