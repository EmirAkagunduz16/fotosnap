import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as authSchema from './schema';
import { AuthModule as BetterAuthNestModule } from '@thallesp/nestjs-better-auth';

export const AUTH_INSTANCE = Symbol('AUTH_INSTANCE');

@Global()
@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        DatabaseModule,
        ConfigModule,
        BetterAuthNestModule.forRootAsync({
          imports: [DatabaseModule, ConfigModule],
          inject: [DATABASE_CONNECTION, ConfigService],
          useFactory: (database: any, configService: ConfigService) => {
            const auth = betterAuth({
              basePath: '/api/auth',
              database: drizzleAdapter(database, {
                provider: 'pg',
                schema: authSchema,
              }),
              trustedOrigins: [configService.getOrThrow<string>('UI_URL')],
              emailAndPassword: {
                enabled: true,
              },
            });
            return { auth, isGlobal: true };
          },
        }),
      ],
      providers: [
        {
          provide: AUTH_INSTANCE,
          inject: [DATABASE_CONNECTION, ConfigService],
          useFactory: (database: any, configService: ConfigService) => {
            return betterAuth({
              basePath: '/api/auth',
              database: drizzleAdapter(database, {
                provider: 'pg',
                schema: authSchema,
              }),
              trustedOrigins: [configService.getOrThrow<string>('UI_URL')],
              emailAndPassword: {
                enabled: true,
              },
            });
          },
        },
      ],
      exports: [AUTH_INSTANCE, BetterAuthNestModule],
    };
  }
}

