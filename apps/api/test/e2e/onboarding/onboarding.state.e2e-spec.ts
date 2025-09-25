import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

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

describe('Onboarding State (e2e)', () => {
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

  it('GET /onboarding/state → 200 returns step for current user', async () => {
    // Register a new user
    const email = `state_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    const regBody = {
      email,
      password,
      firstName: 'On',
      lastName: 'Board',
      acceptTerms: true,
    };
    await request(app.getHttpServer()).post('/auth/register').send(regBody).expect(201);

    // Login to obtain access token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    const token: string = loginRes.body.accessToken;

    logStep('STATE', 'GET /onboarding/state');
    logSend({ Authorization: 'Bearer [len ' + token.length + ']' });

    const res = await request(app.getHttpServer())
      .get('/onboarding/state')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    logRecv(res.body);

    expect(res.body).toHaveProperty('step');
    expect(typeof res.body.step).toBe('string');
  });
});

