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

describe('Auth Forgot Password (e2e)', () => {
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

  it('POST /auth/forgot-password → 204', async () => {
    const userRepo = app.get<ReturnType<any>>(getRepositoryToken(User));
    const email = `forgot_${Date.now()}@test.dev`;
    const passwordHash = await argon2.hash('P4ssword_is_Strong!');
    await userRepo.save(
      userRepo.create({
        email,
        passwordHash,
        firstName: 'Fran',
        lastName: 'Got',
        termsAcceptedAt: new Date(),
      }),
    );

    logStep('FORGOT', 'POST /auth/forgot-password');
    const body = { email };
    logSend(body);
    const res = await request(app.getHttpServer()).post('/auth/forgot-password').send(body).expect(204);
    logRecv({ status: res.status });
  });
});

