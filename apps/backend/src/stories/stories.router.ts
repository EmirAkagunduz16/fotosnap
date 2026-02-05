import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from '@mguay/nestjs-trpc';
import { z } from 'zod';
import { AuthTrpcMiddleware } from 'src/auth/auth-trpc-middleware';
import {
  CreateStoryInput,
  createStorySchema,
  storyGroupSchema,
} from '@repo/trpc/schemas';
import { AppContext } from 'src/app-contex.interface';
import { StoriesService } from './stories.service';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class StoriesRouter {
  constructor(private readonly storiesService: StoriesService) {}

  @Mutation({ input: createStorySchema })
  async create(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.storiesService.create(createStoryInput, ctx.user.id);
  }

  @Query({ output: z.array(storyGroupSchema) })
  async findAll(@Ctx() ctx: AppContext) {
    return this.storiesService.findAll(ctx.user.id);
  }
}
