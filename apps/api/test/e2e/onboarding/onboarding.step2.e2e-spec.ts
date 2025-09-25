import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { Company } from '../../../src/companies/entities/company.entity';
import { EmploymentType } from '../../../src/common/enums';

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

describe('Onboarding Step2 (e2e)', () => {
  let app: INestApplication;
  let companyRepo: any;

  async function registerAndLoginWithStep1(employment: 'APPRENTICE' | 'STUDENT' | 'INTERN' = 'APPRENTICE'):
    Promise<{ token: string; email: string }>
  {
    const email = `step2_${Date.now()}@test.dev`;
    const password = 'P4ssword_is_Strong!';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, firstName: 'Step', lastName: 'Two', acceptTerms: true })
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    const token = login.body.accessToken as string;
    // do step1 to set employment
    await request(app.getHttpServer())
      .patch('/onboarding/step1')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'x', lastName: 'y', employment, contacts: [] })
      .expect(200);
    return { token, email };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    companyRepo = app.get(getRepositoryToken(Company));
  });

  afterAll(async () => {
    await app.close();
  });

  it('APPRENTICE → creates current job, sets DONE and state returns DONE', async () => {
    const { token } = await registerAndLoginWithStep1('APPRENTICE');

    // Seed a company
    const co = await companyRepo.save(
      companyRepo.create({ name: 'Acme ' + Date.now(), siren: 'S' + Date.now(), verified: true, city: 'Paris' }),
    );

    logStep('STEP2', 'PATCH /onboarding/step2');
    const body = {
      employment: EmploymentType.APPRENTICE,
      company: { id: co.id },
      startDate: '2024-01-01',
      title: 'Dev',
    } as const;
    logSend({ Authorization: 'Bearer [len ' + token.length + ']', body });
    const res = await request(app.getHttpServer())
      .patch('/onboarding/step2')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);
    logRecv(res.body);
    expect(res.body.user.onboardingStep).toBe('DONE');
    expect(res.body.currentJob).toBeTruthy();
    expect(res.body.currentJob.employment).toBe(EmploymentType.APPRENTICE);

    // Verify state is DONE
    logStep('STATE', 'GET /onboarding/state');
    const state = await request(app.getHttpServer())
      .get('/onboarding/state')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    logRecv(state.body);
    expect(state.body.step).toBe('DONE');
  });

  it('STUDENT → sets DONE with job (company null allowed)', async () => {
    const { token } = await registerAndLoginWithStep1('STUDENT');

    const body = {
      employment: EmploymentType.STUDENT,
      title: 'Student',
    } as const;
    logStep('STEP2', 'PATCH /onboarding/step2');
    logSend({ Authorization: 'Bearer [len ' + token.length + ']', body });
    const res = await request(app.getHttpServer())
      .patch('/onboarding/step2')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);
    logRecv(res.body);
    expect(res.body.user.onboardingStep).toBe('DONE');
    expect(res.body.currentJob).toBeTruthy();
    expect(res.body.currentJob.employment).toBe(EmploymentType.STUDENT);
  });

  it('APPRENTICE without company/startDate → 400', async () => {
    const { token } = await registerAndLoginWithStep1('APPRENTICE');

    logStep('STEP2', 'PATCH /onboarding/step2');
    const bad = { employment: EmploymentType.APPRENTICE } as const;
    logSend({ Authorization: 'Bearer [len ' + token.length + ']', bad });
    const res = await request(app.getHttpServer())
      .patch('/onboarding/step2')
      .set('Authorization', `Bearer ${token}`)
      .send(bad);
    logRecv({ status: res.status, body: res.body });
    expect(res.status).toBe(400);
  });
});
