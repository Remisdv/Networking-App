import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { Auth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject('FIREBASE_AUTH') private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
      throw new UnauthorizedException('Missing Authorization: Bearer <token>');
    }

    try {
      await this.auth.verifyIdToken(token, true);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
