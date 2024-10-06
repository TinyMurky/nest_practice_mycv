import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('E2E => auth should sign up and get cookie => GET(/auth/signup)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(201); // test 後面可以繼續接下去 ex .expect(201).expect("hello!"), 也可以.then(res => {})

    const user = res.body;
    expect(user.id).toBeGreaterThan(0);
    expect(user.email).toBe('test@test.com');

    const { header } = res;
    const cookie = header['set-cookie'];

    // console.log(JSON.stringify(cookie, null, 2));

    const resWhoAmI = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    const userInCookie = resWhoAmI.body;
    expect(userInCookie.id).toBeGreaterThan(0);
    expect(userInCookie.email).toBe('test@test.com');
  });

  it('E2E => auth should sign in and get cookie  => GET(/auth/signin)', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(201);
    const resSignIn = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(201); // test 後面可以繼續接下去 ex .expect(201).expect("hello!"), 也可以.then(res => {})

    const user = resSignIn.body;
    expect(user.id).toBeGreaterThan(0);
    expect(user.email).toBe('test@test.com');
  });
});
