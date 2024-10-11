import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from '@/reports/reports.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentUser } from '@/users/decorators/current-user.decorator';
import { User } from '@/users/users.entity';
import { CreateReportDto } from '@/reports/dtos/create-report.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ReportDto } from '@/reports/dtos/report.dto';

@Controller('/reports')
export class ReportsController {
  constructor(private _reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  @Post()
  /**
   * Info: (20241010 - Murky)
   * Create Report and associate user in session
   * @param {User} user - user pass from CurrentUserInterceptor
   * and get by CurrentUser decorator
   */
  public create(
    @CurrentUser() user: User,
    @Body() createReportDto: CreateReportDto,
  ) {
    if (!user) {
      throw new NotFoundException('User Does not provided');
    }

    return this._reportsService.create({
      createReportDto,
      user,
    });
  }
}
