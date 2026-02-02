"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User } from "lucide-react";

interface Post {
  id: number;
  user: {
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

// const mockPosts: Post[] = [
//   {
//     id: "1",
//     user: {
//       username: "johndoe",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     },
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     caption: "Enjoying the sunny day!",
//     likes: 120,
//     comments: 15,
//     timestamp: "2 hours ago",
//   },
//   {
//     id: "2",
//     user: {
//       username: "janedoe",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     },
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     caption: "Enjoying the sunny day!",
//     likes: 10,
//     comments: 1,
//     timestamp: "1 hours ago",
//   },
//   {
//     id: "3",
//     user: {
//       username: "micheal",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     },
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     caption: "Enjoying!",
//     likes: 1900,
//     comments: 35,
//     timestamp: "18 hours ago",
//   },
//   {
//     id: "4",
//     user: {
//       username: "jhonny",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     },
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
//     caption: "Enjoying the funny day!",
//     likes: 520,
//     comments: 10,
//     timestamp: "2 week ago",
//   },
// ];

interface FeedProps {
  posts: Post[];
}

export default function Feed({ posts }: FeedProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  const getImageUrl = (imagePath: string) => {
    // Resimler uploads/images/ klasöründe
    const path = imagePath.startsWith("images/") ? imagePath : `images/${imagePath}`;
    return `${BASE_URL}/uploads/${path}`;
  };

  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) {
      return "";
    }
    const path = avatarPath.startsWith("images/") ? avatarPath : `images/${avatarPath}`;
    return `${BASE_URL}/uploads/${path}`;
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {getAvatarUrl(post.user.avatar) ? (
                <Image
                  src={getAvatarUrl(post.user.avatar)}
                  alt={post.user.username}
                  width={64}
                  height={64}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <span className="font-semibold text-sm">
                {post.user.username}
              </span>
            </div>
          </div>

          <div className="aspect-square relative">
            <Image
              src={getImageUrl(post.image)}
              alt="Post"
              className="object-cover"
              fill
            />
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => {}}
                  className="p-0 h-auto"
                >
                  <Heart className="w-6 h-6 text-foreground" />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => {}}
                  className="p-0 h-auto"
                >
                  <MessageCircle className="w-6 h-6 text-foreground" />
                </Button>
              </div>
            </div>

            <div className="text-sm font-semibold">{post.likes} likes</div>

            <div className="text-sm">
              <span className="font-semibold mr-1">{post.user.username} </span>
              {post.caption}
            </div>

            {post.comments > 0 && (
              <div className="text-sm text-muted-foreground">
                View all {post.comments} comments
              </div>
            )}

            <div className="text-xs text-muted-foreground uppercase">
              {post.timestamp}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
