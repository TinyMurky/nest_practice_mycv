import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

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
    it('should return report but only with user id not User', async () => {
      // Sign up first
      const reqSignUp = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .expect(201);

      const { header } = reqSignUp;
      const cookie = header['set-cookie'];

      const resReportCreate = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .expect(201);
      const report = resReportCreate.body;

      expect(report.userId).toBeGreaterThanOrEqual(0);
      expect(report.user).toBeUndefined();
    });
  });
});
