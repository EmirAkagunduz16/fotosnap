import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from 'src/database/database.module';
import { like, post, savedPost } from './schemas/schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    await this.database
      .insert(post)
      .values({
        userId,
        caption: createPostInput.caption,
        image: createPostInput.image,
        createdAt: new Date(),
      })
      .returning();
  }

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      with: {
        user: true,
        likes: true,
        comments: true,
      },
      where: postUserId ? eq(post.userId, postUserId) : undefined,
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((p) => ({
      id: p.id,
      user: {
        username: p.user.name,
        id: p.user.id,
        avatar: p.user.image || '',
      },
      image: p.image,
      likes: p.likes.length,
      caption: p.caption,
      timestamp: p.createdAt.toISOString(),
      comments: p.comments.length,
      isLiked: p.likes.some((like) => like.userId === userId),
    }));
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.database.query.like.findFirst({
      where: and(eq(like.postId, postId), eq(like.userId, userId)),
    });
    if (existingLike) {
      await this.database.delete(like).where(eq(like.id, existingLike.id));
    } else {
      await this.database.insert(like).values({
        postId,
        userId,
      });
    }
  }

  async savePost(postId: number, userId: string) {
    const existingSave = await this.database.query.savedPost.findFirst({
      where: and(eq(savedPost.postId, postId), eq(savedPost.userId, userId)),
    });

    if (existingSave) {
      await this.database
        .delete(savedPost)
        .where(eq(savedPost.id, existingSave.id));
    } else {
      await this.database.insert(savedPost).values({
        postId,
        userId,
        createdAt: new Date(),
      });
    }
  }

  async getSavedPosts(userId: string): Promise<Post[]> {
    const saved = await this.database.query.savedPost.findMany({
      where: eq(savedPost.userId, userId),
      with: {
        post: {
          with: {
            user: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [desc(savedPost.createdAt)],
    });
    return saved.map((sp) => ({
      id: sp.post.id,
      user: {
        id: sp.post.user.id,
        name: sp.post.user.name,
        avatar: sp.post.user.image || '',
        username: sp.post.user.name,
      },
      image: sp.post.image,
      caption: sp.post.caption,
      likes: sp.post.likes.length,
      timestamp: sp.post.createdAt.toISOString(),
      comments: sp.post.comments.length,
      isLiked: sp.post.likes.some((like) => like.userId === userId),
      isSaved: true,
    }));
  }
}
