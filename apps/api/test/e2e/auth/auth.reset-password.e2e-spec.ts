import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as argon2 from 'argon2';

import { AppModule } from '../../../src/app.module';
import { User } from '../../../src/users/entities/user.entity';
import { PasswordReset } from '../../../src/auth/entities/password-reset.entity';

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

describe('Auth Reset Password (e2e)', () => {
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

  it('POST /auth/reset-password → 204 and can login with new password', async () => {
    const userRepo = app.get<ReturnType<any>>(getRepositoryToken(User));
    const resetRepo = app.get<ReturnType<any>>(getRepositoryToken(PasswordReset));

    const email = `reset_${Date.now()}@test.dev`;
    const oldPass = 'Old_password_is_Strong!';
    const newPass = 'New_password_is_Stronger!';

    const passwordHash = await argon2.hash(oldPass);
    const user = await userRepo.save(
      userRepo.create({
        email,
        passwordHash,
        firstName: 'Rhea',
        lastName: 'Set',
        termsAcceptedAt: new Date(),
      }),
    );

    const rawToken = 'reset-token-' + Date.now();
    const tokenHash = await argon2.hash(rawToken);
    await resetRepo.save(
      resetRepo.create({ userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 3600_000) }),
    );

    logStep('RESET', 'POST /auth/reset-password');
    const body = { token: rawToken, newPassword: newPass };
    logSend(body);
    const res = await request(app.getHttpServer()).post('/auth/reset-password').send(body).expect(204);
    logRecv({ status: res.status });

    // Now login with new password
    logStep('LOGIN', 'POST /auth/login');
    logSend({ email, password: newPass });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: newPass })
      .expect(200);
    logRecv({ tokenType: loginRes.body.tokenType, hasAccessToken: !!loginRes.body.accessToken });
  });
});

