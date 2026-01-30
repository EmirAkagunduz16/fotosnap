import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const AUTH_INSTANCE = Symbol('AUTH_INSTANCE');

@Global()
@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [DatabaseModule, ConfigModule],
      providers: [
        {
          provide: AUTH_INSTANCE,
          inject: [DATABASE_CONNECTION, ConfigService],
          useFactory: (database: any, configService: ConfigService) => {
            return betterAuth({
              basePath: '/api/auth',
              database: drizzleAdapter(database, {
                provider: 'pg',
              }),
              trustedOrigins: [configService.getOrThrow<string>('UI_URL')],
              emailAndPassword: {
                enabled: true,
              },
            });
          },
        },
      ],
      exports: [AUTH_INSTANCE],
    };
  }
}
