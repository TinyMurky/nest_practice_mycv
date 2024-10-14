import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from '@/reports/reports.entity';
import { CreateReportDto } from '@/reports/dtos/create-report.dto';
import { User } from '@/users/users.entity';
import { GetEstimateReport } from '@/reports/dtos/get-estimate-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private _repo: Repository<Report>) {}

  /**
   * Creates a new report and associates it with a user.
   * the report return will also include User
   * @param {Object} params - The parameters for creating a report.
   * @param {CreateReportDto} params.createReportDto - The data transfer object containing the details of the report.
   * @param {User} params.user - The user who creates the report and will be associated with it.
   *
   * @returns {Promise<Report>} - Returns a Promise that resolves to the newly created and saved report with the user included.
   */
  public create({
    createReportDto,
    user,
  }: {
    createReportDto: CreateReportDto;
    user: User;
  }) {
    const report = this._repo.create(createReportDto);
    report.user = user;

    // Save的report回傳會直接有User
    return this._repo.save(report);
  }

  /**
   * Change 'approved state'  of certain id
   * @param id - id of report that will be change
   * @param isApproved - boolean state of 'report'
   * @returns
   */
  public async changeApproval(id: number, isApproved: boolean) {
    /**
     * Report that will be change state
     * @description hi!
     */
    // const report = await this._repo.findOneBy({
    //   id: id,
    // });
    const report = await this._repo.findOne({
      where: {
        id: id,
      },
      relations: ['user'], // 這樣子save的回傳才會有user
    });

    if (!report) {
      throw new NotFoundException(`Report id: ${id} not found`);
    }

    report.approved = isApproved;
    return this._repo.save(report);
  }

  public getEstimateReport({
    make,
    model,
    lng,
    lat,
    mileage,
    year,
  }: GetEstimateReport) {
    // Where 和and where 裡的 :xxx 的xxx全部只能出現一次，
    const prices = this._repo
      .createQueryBuilder()
      .select('AVG(price)', 'price') // 是 AVG(price)' AS price的意思
      // .from(Report, 'report')
      .where('make LIKE :reportMake', { reportMake: `%${make}%` })
      .andWhere('model LIKE :reportModel', { reportModel: `%${model}%` }) // %不能放在query裡
      .andWhere('ABS(lng - :reportLng) <= 5', { reportLng: lng })
      .andWhere('ABS(lat - :reportLat) <= 5', { reportLat: lat })
      .andWhere('ABS(year - :reportYear) <= 5', { reportYear: year })
      .orderBy('ABS(mileage - :reportMileage)', 'DESC') // orderBy如果要另外用特殊直去sort
      .setParameters({
        reportMileage: mileage,
      })
      .limit(3)
      .getRawOne();
    return prices;
  }
}
