import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (process.env.TEST_DB === 'sqlite') {
          return {
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            autoLoadEntities: true,
            synchronize: true,
          } as any;
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST', 'localhost'),
          port: Number(configService.get<number>('DATABASE_PORT', 5432)),
          username: configService.get<string>('DATABASE_USER', 'root'),
          password: configService.get<string>('DATABASE_PASSWORD', 'zDb1kpvxpj0xTAfDflTk8k4B'),
          database: configService.get<string>('DATABASE_NAME', 'networking-database'),
          autoLoadEntities: true,
          synchronize: true,
        } as any;
      },
    }),
    AuthModule,
    OnboardingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
