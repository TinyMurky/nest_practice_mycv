import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { CreateReportDto } from '@/reports/dtos/create-report.dto';

describe('ReportController (e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('E2E => Report route => Post()', () => {
    const mockCreateReportDto: CreateReportDto = {
      price: 100,
      make: 'Toyota',
      model: 'v1',
      lat: 27.153006,
      lng: 4.637797,
      year: 1993,
      mileage: 10000,
    };

    it('should return report but only with user id not User', async () => {
      // Sign up first
      const resSignUp = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .expect(201);

      const { header } = resSignUp;
      const cookie = header['set-cookie'];
      console.log('cookie:', cookie);

      const resReportCreate = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send(mockCreateReportDto)
        .expect(201);
      const report = resReportCreate.body;
      console.log('Report json: ', JSON.stringify(report));

      expect(report.userId).toBeGreaterThanOrEqual(0);
      expect(report.user).toBeUndefined();
    });
  });

  describe('E2E => Report route => Patch(/id) => change approve ', () => {
    it('should return 401 unauthorized if patch by normal user', () => {});
  });
});
