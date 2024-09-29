import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import { AuthService } from '@/users/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
