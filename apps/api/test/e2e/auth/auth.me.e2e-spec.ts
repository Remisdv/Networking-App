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
  if (clone?.user?.passwordHash) clone.user.passwordHash = '[hidden-hash]';
  // eslint-disable-next-line no-console
  console.log(`RECV ${JSON.stringify(clone, null, 2)}`);
}

describe('Auth Me (e2e)', () => {
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

  it('GET /auth/me → 200 and returns user', async () => {
    // Seed + login to get a token
    const userRepo = app.get<ReturnType<any>>(getRepositoryToken(User));
    const email = `me_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    const passwordHash = await argon2.hash(password);
    await userRepo.save(
      userRepo.create({
        email,
        passwordHash,
        firstName: 'Mia',
        lastName: 'User',
        termsAcceptedAt: new Date(),
      }),
    );

    const loginBody = { email, password };
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send(loginBody).expect(200);
    const token = loginRes.body.accessToken as string;

    logStep('ME', 'GET /auth/me');
    logSend({ Authorization: `Bearer [len ${token.length}]` });

    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    logRecv(res.body);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
  });
});

