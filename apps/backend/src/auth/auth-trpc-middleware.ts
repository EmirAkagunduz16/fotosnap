import { Inject, Injectable } from '@nestjs/common';
import { AUTH_INSTANCE } from './auth.module';
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc';
import type { Auth } from 'better-auth';

@Injectable()
export class AuthTrpcMiddleware implements TRPCMiddleware {
  constructor(@Inject(AUTH_INSTANCE) private readonly auth: Auth) {}

  async use(
    opts: MiddlewareOptions<{ req: any; res: any }>,
  ): Promise<MiddlewareResponse> {
    const { ctx, next } = opts;

    try {
      const session = await this.auth.api.getSession({
        headers: ctx.req.headers,
      });

      if (session?.user) {
        return next({
          ctx: {
            ...ctx,
            user: session.user,
            session: session.session,
          },
        });
      }

      throw new Error('Unauthorized');
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }
}

