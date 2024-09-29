import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from '@/reports/reports.controller';
import { ReportsService } from '@/reports/reports.service';

import { Report } from '@/reports/reports.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
