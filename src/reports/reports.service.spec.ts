import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType, repositoryMockFactory } from '@/libs/mock_repo';
import { ReportsService } from '@/reports/reports.service';
import { Report } from '@/reports/reports.entity';
import { User } from '@/users/users.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let repoMock: MockType<Repository<Report>>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
  } as User;

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repoMock = module.get(getRepositoryToken(Report));

    repoMock.save.mockReturnValue(mockReport);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
