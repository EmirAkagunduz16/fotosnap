import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import {
  CreatePostInput,
  createPostSchema,
  postSchema,
} from './schemas/trpc.schema';
import { PostsService } from './posts.service';
import z from 'zod';

@Router()
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema, output: postSchema })
  async create(@Input() createPostDto: CreatePostInput) {
    return this.postsService.create(createPostDto, '123');
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
