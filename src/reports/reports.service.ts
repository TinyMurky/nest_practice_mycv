import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '@/reports/reports.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private _repo: Repository<Report>) {}

  public create() {}

  public findOneById() {}

  public find() {}
}
