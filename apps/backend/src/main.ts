import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AUTH_INSTANCE } from './auth';
import { toNodeHandler } from 'better-auth/node';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const uiUrl = configService.getOrThrow<string>('UI_URL');

  // Enable CORS
  app.enableCors({
    origin: uiUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Get auth instance from DI container and register routes
  const auth = app.get(AUTH_INSTANCE);
  const expressApp = app.getHttpAdapter().getInstance();
  const handler = toNodeHandler(auth);

  // Register auth routes with Express 5 compatible regex pattern
  expressApp.all(/^\/api\/auth\/.*/, (req: any, res: any) => {
    return handler(req, res);
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
