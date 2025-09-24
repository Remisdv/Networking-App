// apps/api/src/config/firebase.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // App
    {
      provide: 'FIREBASE_APP',
      useFactory: (config: ConfigService) => {
        const projectId = config.get<string>('FIREBASE_PROJECT_ID');
        const useEmulators = config.get<string>('FIREBASE_EMULATORS') === 'true';

        if (!projectId) {
          throw new Error('FIREBASE_PROJECT_ID env var is required');
        }

        if (admin.apps.length === 0) {
          if (useEmulators) {
            admin.initializeApp({ projectId });
          } else {
            const clientEmail = config.get<string>('FIREBASE_CLIENT_EMAIL');
            let privateKey = config.get<string>('FIREBASE_PRIVATE_KEY') || '';
            privateKey = privateKey.replace(/\\n/g, '\n');
            admin.initializeApp({
              credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            });
          }
        }
        return admin.app();
      },
      inject: [ConfigService],
    },

    // Auth
    {
      provide: 'FIREBASE_AUTH',
      useFactory: (app: admin.app.App): Auth => getAuth(app),
      inject: ['FIREBASE_APP'],
    },

    // Firestore
    {
      provide: 'FIREBASE_FIRESTORE',
      useFactory: (app: admin.app.App): Firestore => getFirestore(app),
      inject: ['FIREBASE_APP'],
    },
  ],
  exports: ['FIREBASE_APP', 'FIREBASE_AUTH', 'FIREBASE_FIRESTORE'],
})
export class FirebaseModule {}
