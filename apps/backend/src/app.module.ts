import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';
import { TRPCModule } from 'nestjs-trpc';
import { UsersModule } from './auth/users/users.module';
import { UploadModule } from './upload/upload.module';
import { AppContext } from './app.context';
import { AuthTrpcMiddleware } from './auth/auth-trpc-middleware';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
      context: AppContext,
      basePath: '/api/trpc',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule.forRoot(),
    PostsModule,
    UsersModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AuthTrpcMiddleware, AppContext],
})
export class AppModule {}
