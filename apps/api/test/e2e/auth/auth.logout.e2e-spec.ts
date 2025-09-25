import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as argon2 from 'argon2';

import { AppModule } from '../../../src/app.module';
import { User } from '../../../src/users/entities/user.entity';

function logStep(name: string, route: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${name} ${route}`);
}

function logSend(payload: unknown) {
  // eslint-disable-next-line no-console
  console.log(`SEND ${JSON.stringify(payload, null, 2)}`);
}

function logRecv(payload: unknown) {
  // eslint-disable-next-line no-console
  console.log(`RECV ${JSON.stringify(payload, null, 2)}`);
}

describe('Auth Logout (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/logout → 204 and refresh becomes invalid', async () => {
    const userRepo = app.get<ReturnType<any>>(getRepositoryToken(User));
    const email = `logout_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    const passwordHash = await argon2.hash(password);
    await userRepo.save(
      userRepo.create({
        email,
        passwordHash,
        firstName: 'Log',
        lastName: 'Out',
        termsAcceptedAt: new Date(),
      }),
    );

    const login = await request(app.getHttpServer()).post('/auth/login').send({ email, password }).expect(200);
    const accessToken: string = login.body.accessToken;
    const refreshToken: string = login.body.refreshToken;

    logStep('LOGOUT', 'POST /auth/logout');
    logSend({ Authorization: 'Bearer [len ' + accessToken.length + ']', refreshToken: '[len ' + refreshToken.length + ']' });
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(204);
    logRecv({ status: res.status });

    // Try to refresh again -> should fail (revoked)
    logStep('REFRESH', 'POST /auth/refresh');
    logSend({ refreshToken: '[len ' + refreshToken.length + ']' });
    const ref = await request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken });
    logRecv({ status: ref.status });
    expect(ref.status).toBe(401);
  });
});

