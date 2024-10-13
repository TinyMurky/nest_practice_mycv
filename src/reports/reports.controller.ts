import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
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
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CheckRoleAuth } from '@/guards/role.guard';
import { Role } from '@/constants/enum/user';

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

  @UseGuards(AuthGuard)
  @CheckRoleAuth([Role.Admin])
  @Serialize(ReportDto)
  @Patch('/:id')
  /**
   * Need to be admin to add or remove approval
   * @param id - {string} id of report from Param
   * @param approveReport - {ApproveReportDto} have is approve
   */
  public changeApproval(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    const { isApproved } = approveReportDto;

    return this._reportsService.changeApproval(id, isApproved);
  }
}
