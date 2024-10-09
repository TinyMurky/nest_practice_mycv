import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReportsService } from '@/reports/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private _reportsService: ReportsService) {}

  @Post()
  create() {
    return this._reportsService.create();
  }

  @Get()
  find() {
    return this._reportsService.find();
  }

  @Get('/:id')
  findById(@Param() id: number) {
    console.log(id);
    return this._reportsService.findOneById();
  }
}
