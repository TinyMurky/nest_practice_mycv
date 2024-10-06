import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { UsersModule } from '@/users/users.module';
import { ReportsModule } from '@/reports/reports.module';

import { User } from '@/users/users.entity';
import { Report } from '@/reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// {
//       type: 'sqlite',
//       database: './database/db.sqlite',
//       entities: [User, Report], // Info: (20240928 - Murky) For all database table entity
//       synchronize: true, // Info: (20240928 - Murky) True for automatic create schema when start up
//     }
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('SQL_URL'),
          entities: [User, Report], // Info: (20240928 - Murky) For all database table entity
          synchronize: true, // Info: (20240928 - Murky) True for automatic create schema when start up
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // Info: (20241006 - Murky) new Validation 的話就布農用class
      useValue: new ValidationPipe({
        whitelist: true, // Info: (20240928 - Murky) Json Post進來的時候， 不再dto規定的內容會先被過濾掉
      }),
    },
  ],
})
export class AppModule {
  // Info: (20241006 - Murky) 用middleware => 全部route的方法讓cookieParse middleware套用到全部route
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser('EvilNeuroSoCute!')).forRoutes('*');
  }
}
