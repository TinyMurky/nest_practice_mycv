import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { UsersModule } from '@/users/users.module';
import { ReportsModule } from '@/reports/reports.module';

import { User } from '@/users/users.entity';
import { Report } from '@/reports/reports.entity';

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/db.sqlite',
      entities: [User, Report], // Info: (20240928 - Murky) For all database table entity
      synchronize: true, // Info: (20240928 - Murky) True for automatic create schema when start up
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
