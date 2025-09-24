import { Inject, Injectable } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseAdminService {
  constructor(
    @Inject('FIREBASE_FIRESTORE') public readonly firestore: Firestore,
    @Inject('FIREBASE_AUTH') public readonly auth: Auth,
  ) {}
}