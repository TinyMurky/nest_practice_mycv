import { Test, TestingModule } from '@nestjs/testing';

import { ReportsController } from '@/reports/reports.controller';
import { ReportsService } from '@/reports/reports.service';
import { User } from '@/users/users.entity';
import { Report } from '@/reports/reports.entity';
import { CreateReportDto } from '@/reports/dtos/create-report.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportService: Partial<ReportsService>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
  } as User;

  const mockCreateReportDto: CreateReportDto = {
    price: 100,
    make: 'Toyota',
    model: 'v1',
    lat: 27.153006,
    lng: 4.637797,
    year: 1993,
    mileage: 10000,
  };

  const mockReport: Report = {
    id: 1,
    price: 100,
    make: 'Toyota',
    model: 'v1',
    lat: 27.153006,
    lng: 4.637797,
    year: 1993,
    mileage: 10000,
    user: mockUser,
    approved: false,
  };

  beforeEach(async () => {
    fakeReportService = {
      create: jest.fn().mockResolvedValue(mockReport),
      changeApproval: jest.fn().mockResolvedValue(mockReport),
    };

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotfoundException if user is not provided', async () => {
      const user = undefined;

      // 因為create是 同步，所以不是await expect, 而是要包在一個function裡面
      expect(() => controller.create(user, mockCreateReportDto)).toThrow(
        NotFoundException,
      );
    });

    it('should call create in service', async () => {
      const report = await controller.create(mockUser, mockCreateReportDto);
      expect(fakeReportService.create).toHaveBeenCalled();
      expect(report).toBeDefined();
      expect(report.user).toBeDefined();
    });
  });
});
