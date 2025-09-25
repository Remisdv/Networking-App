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

describe('Auth Refresh (e2e)', () => {
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

  it('POST /auth/refresh → 200 and returns new tokens', async () => {
    const userRepo = app.get<ReturnType<any>>(getRepositoryToken(User));
    const email = `refresh_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    const passwordHash = await argon2.hash(password);
    await userRepo.save(
      userRepo.create({
        email,
        passwordHash,
        firstName: 'Rene',
        lastName: 'Fresh',
        termsAcceptedAt: new Date(),
      }),
    );

    // Login to get a refreshToken
    const login = await request(app.getHttpServer()).post('/auth/login').send({ email, password }).expect(200);
    const refreshToken: string = login.body.refreshToken;

    logStep('REFRESH', 'POST /auth/refresh');
    logSend({ refreshToken: `[len ${refreshToken.length}]` });
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200);
    logRecv({ tokenType: res.body.tokenType, hasAccessToken: !!res.body.accessToken });

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('tokenType', 'Bearer');
  });
});

