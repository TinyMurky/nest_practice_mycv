import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

// Info: (20240928 - Murky) 這個interface只要是class都通過
interface ClassConstructor {
  new (...args: any[]): unknown;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/**
 * Info: (20240928 - Murky)
 * https://www.udemy.com/course/nestjs-the-complete-developers-guide/learn/lecture/27442206#overview
 * https://docs.nestjs.com/interceptors
 */
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Info: (20240928 - Murky) next 其實就是"有一點"像是Request Handler的Reference
    // ExecutionContext: information on incoming request

    // Run something before request was  handle
    console.log('Run Before request is handled');
    return next.handle().pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map((data: any) => {
        // Info: (20240928 - Murky) data就是 route回傳的東西
        // Response before send out
        console.log(
          'Run after request was handled, but before response send out',
        );

        const dto = plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // Info: (20240928 - Murky) 只有標示 @Expose的資料才能出去
        });
        return dto;
      }),
    );
  }
}
