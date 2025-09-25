import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as argon2 from 'argon2';

import { AppModule } from '../../../src/app.module';
import { User } from '../../../src/users/entities/user.entity';

// Plain logging (no colors)

function logStep(name: string, route: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${name} ${route}`);
}

function logSend(payload: unknown) {
  // eslint-disable-next-line no-console
  console.log(`SEND ${JSON.stringify(payload, null, 2)}`);
}

function logRecv(payload: any) {
  const clone = payload ? JSON.parse(JSON.stringify(payload)) : payload;
  // eslint-disable-next-line no-console
  console.log(`RESPONSE ${JSON.stringify(clone, null, 2)}`);
}

describe('Auth Login (e2e)', () => {
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

  it('POST /auth/login → 200 and returns tokens', async () => {
    // Seed a user directly via repository (no extra route logs)
    const userRepo = app.get<ReturnType<any>>(getRepositoryToken(User));
    const email = `login_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    const passwordHash = await argon2.hash(password);
    await userRepo.save(
      userRepo.create({
        email,
        passwordHash,
        firstName: 'Jane',
        lastName: 'Doe',
        termsAcceptedAt: new Date(),
      }),
    );

    logStep('LOGIN', 'POST /auth/login');
    const body = { email, password };
    logSend(body);

    const res = await request(app.getHttpServer()).post('/auth/login').send(body).expect(200);
    logRecv(res.body);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('tokenType', 'Bearer');
    expect(typeof res.body.accessToken).toBe('string');
  });
});
