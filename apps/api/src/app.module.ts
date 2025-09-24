import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseModule } from './config/firebase.module';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: FirebaseAuthGuard }],
})
export class AppModule {}
