import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from '@/reports/reports.entity';
import { CreateReportDto } from '@/reports/dtos/create-report.dto';
import { User } from '@/users/users.entity';

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
}
