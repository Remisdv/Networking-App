// apps/api/src/modules/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  private readonly sessionDurationMs = 60 * 60 * 24 * 5 * 1000; // 5 days

  constructor(@Inject('FIREBASE_AUTH') private readonly auth: Auth) {}

  async createSession(idToken: string): Promise<{ sessionCookie: string; expiresIn: number }> {
    try {
      const decoded = await this.auth.verifyIdToken(idToken, true);
      const expiresIn = this.sessionDurationMs;
      const sessionCookie = await this.auth.createSessionCookie(idToken, { expiresIn });

      if (!decoded.roles) {
        await this.auth.setCustomUserClaims(decoded.uid, { roles: [] });
      }

      return { sessionCookie, expiresIn };
    } catch {
      throw new UnauthorizedException('Unable to create session');
    }
  }
}
