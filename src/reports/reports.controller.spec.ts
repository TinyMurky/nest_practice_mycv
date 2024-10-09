import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '@/reports/reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportService: Partial<ReportsService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReportsService,
          useValue: fakeReportService,
        },
      ],
      controllers: [ReportsController],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    fakeReportService = {
      create: jest.fn(),
      find: jest.fn(),
      findOneById: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
