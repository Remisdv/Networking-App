import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

// Plain logging (no colors)
const RESET = '\u001b[0m';
const GREEN = '\u001b[32m';
const BLUE = '\u001b[34m';

function logStep(name: string, route: string) {
  // name (+ route) in green
  // eslint-disable-next-line no-console
  console.log( ` \\n ${name} ${route}`); 
}

function logSend(payload: unknown) {
  // title in blue, then JSON
  // eslint-disable-next-line no-console
  console.log( `SEND ${JSON.stringify(payload, null, 2)}`); 
}

function logRecv(payload: any) {
  const clone = payload ? JSON.parse(JSON.stringify(payload)) : payload;
  if (clone?.user?.passwordHash) clone.user.passwordHash = '[hidden-hash]';
  // eslint-disable-next-line no-console
  console.log( `RESPONSE ${JSON.stringify(clone, null, 2)}`); 
}

describe('Auth Register (e2e)', () => {
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

  it('POST /auth/register ? 201 and returns user', async () => {
    logStep('REGISTER', 'POST /auth/register');
    const email = `reg_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    const body = {
      email,
      password,
      firstName: 'John',
      lastName: 'Doe',
      acceptTerms: true,
    };
    logSend(body);

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(body)
      .expect(201);
    logRecv(res.body);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
    expect(res.body.user).toHaveProperty('id');
  });
});
