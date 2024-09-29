/**
 * Info: (20240929 - Murky)
 * Please check https://docs.nestjs.com/techniques/cookies#creating-a-custom-decorator-cross-platform
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (cookiesKey: string, context: ExecutionContext) => {
    // Info: (20240929 - Murky) context 是同時可以代表http, websocket, gRPC的input的意思
    // ex:
    // @Get()
    // findAll(@Cookies('name') name: string) {}
    const request = context.switchToHttp().getRequest();
    return cookiesKey ? request.cookies?.[cookiesKey] : request.cookies;
  },
);
