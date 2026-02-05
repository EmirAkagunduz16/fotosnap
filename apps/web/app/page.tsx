"use client";

import Feed from "@/components/dashboard/feed";
import PhotoUpload from "@/components/dashboard/photo-upload";
import Sidebar from "@/components/dashboard/sidebar";
import { Stories } from "@/components/dashboard/stories";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const Home = () => {
  const [showUploadModal, setShowModalUpload] = useState(false);
  const posts = trpc.postsRouter.findAll.useQuery({});
  const stories = trpc.storiesRouter.findAll.useQuery();

  const createPost = trpc.postsRouter.create.useMutation({
    onSuccess: () => {
      utils.postsRouter.findAll.invalidate();
    },
  });

  const likePost = trpc.postsRouter.likePost.useMutation({
    onMutate: ({ postId }) => {
      utils.postsRouter.findAll.setData({}, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        });
      });
    },
  });

  const utils = trpc.useUtils();

  const createComment = trpc.commentsRouter.create.useMutation({
    onSuccess: (_, variables) => {
      utils.commentsRouter.findByPostId.invalidate({
        postId: variables.postId,
      });

      utils.postsRouter.findAll.setData({}, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === variables.postId) {
            return {
              ...post,
              comments: post.comments + 1,
            };
          }
          return post;
        });
      });
    },
  });

  const deleteComment = trpc.commentsRouter.delete.useMutation({
    onSuccess: () => {
      utils.commentsRouter.findByPostId.invalidate();
      utils.postsRouter.findAll.invalidate();
    },
  });

  const createStory = trpc.storiesRouter.create.useMutation({
    onSuccess: () => {
      utils.storiesRouter.findAll.invalidate();
    },
  });

  const handleStoryUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Image upload failed");
    }

    const { filename } = await uploadResponse.json();
    await createStory.mutateAsync({
      image: filename,
    });
  };

  const handleCreatePost = async (file: File, caption: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Image upload failed");
    }

    const { filename } = await uploadResponse.json();
    await createPost.mutateAsync({
      image: filename,
      caption,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Stories
              storyGroups={stories.data || []}
              onStoryUpload={handleStoryUpload}
            />
            <Feed
              posts={posts.data || []}
              onLikePost={(postId) => likePost.mutate({ postId })}
              onAddComment={(postId, text) =>
                createComment.mutate({ postId, text })
              }
              onDeleteComment={(commentId) => {
                deleteComment.mutate({ commentId });
              }}
            />
          </div>
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Sidebar />
          </div>
        </div>
      </div>

      <PhotoUpload
        open={showUploadModal}
        onOpenChange={setShowModalUpload}
        onSubmit={handleCreatePost}
      />
      <Button
        onClick={() => setShowModalUpload(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Home;
