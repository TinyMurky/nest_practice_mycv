import { IsBoolean } from 'class-validator';

/**
 * Used to validate body of changeApproval api
 * @public isApproved - {boolean} the state of approved of report that will be change
 * @since 0.0.1
 */
export class ApproveReportDto {
  @IsBoolean()
  /**
   * the state of approved of report that will be change
   * @type {boolean}
   */
  isApproved: boolean;
}
