import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import { AuthService } from '@/users/auth.service';

// Info: (20241003 - Murky) 記得如果想再Module內使用，一定要加在provider
import { CurrentUserInterceptor } from '@/users/interceptors/current-user.interceptor';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // Info: (20241003 - Murky) 單獨Import的時候會是下面這個樣子
  // providers: [UsersService, AuthService, CurrentUserInterceptor],

  // Info: (20241003 - Murky) 有三種發法可以讓interceptor變成Global
  // 下面這種方法可以讓interceptor用到module內的其他function
  // https://docs.nestjs.com/interceptors#binding-interceptors
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
