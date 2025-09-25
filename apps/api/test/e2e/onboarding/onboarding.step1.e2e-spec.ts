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

describe('Onboarding Step1 (e2e)', () => {
  let app: INestApplication;

  async function registerAndLogin() {
    const email = `step1_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, firstName: 'Step', lastName: 'One', acceptTerms: true })
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    return { token: login.body.accessToken as string, email };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /onboarding/step1 → 200 updates identity/contacts and sets STEP2', async () => {
    const { token, email } = await registerAndLogin();

    const body = {
      firstName: 'Johnny',
      lastName: 'Bravo',
      employment: 'APPRENTICE',
      contacts: [
        { label: 'Email', type: 'email', value: email },
        { label: 'LinkedIn', type: 'linkedin', value: 'https://www.linkedin.com/in/example' },
      ],
    } as const;

    logStep('STEP1', 'PATCH /onboarding/step1');
    logSend({ Authorization: 'Bearer [len ' + token.length + ']', body });

    const res = await request(app.getHttpServer())
      .patch('/onboarding/step1')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);

    logRecv(res.body);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.firstName).toBe('Johnny');
    expect(res.body.user.lastName).toBe('Bravo');
    expect(res.body.user.onboardingStep).toBe('STEP2');
  });

  it('PATCH /onboarding/step1 → 400 when > 5 contacts', async () => {
    const { token } = await registerAndLogin();

    const tooMany = {
      firstName: 'A',
      lastName: 'B',
      employment: 'STUDENT',
      contacts: [
        { label: 'c1', type: 'email', value: 'a@a.com' },
        { label: 'c2', type: 'linkedin', value: 'https://lnkd.in/c2' },
        { label: 'c3', type: 'url', value: 'https://a.com' },
        { label: 'c4', type: 'other', value: 'x' },
        { label: 'c5', type: 'other', value: 'y' },
        { label: 'c6', type: 'other', value: 'z' },
      ],
    } as const;

    logStep('STEP1', 'PATCH /onboarding/step1');
    logSend({ Authorization: 'Bearer [len ' + token.length + ']', tooMany });
    const res = await request(app.getHttpServer())
      .patch('/onboarding/step1')
      .set('Authorization', `Bearer ${token}`)
      .send(tooMany);
    logRecv({ status: res.status, body: res.body });
    expect(res.status).toBe(400);
  });
});
