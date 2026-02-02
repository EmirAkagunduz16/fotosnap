"use client";

import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";
import Image from "next/image";
import { ThemeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import { Camera, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/image";
import { useState } from "react";
import AvatarUpload from "./avatar-upload";
import { trpc } from "@/lib/trpc/client";

interface SuggestedUser {
  id: string;
  username: string;
  avatar: string;
  followedBy: string;
}

const mockSuggestions: SuggestedUser[] = [
  {
    id: "1",
    username: "johndoe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    followedBy: "janedoe",
  },
  {
    id: "2",
    username: "janedoe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    followedBy: "johndoe",
  },
  {
    id: "3",
    username: "micheal",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    followedBy: "janedoe",
  },
  {
    id: "4",
    username: "jhonny",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    followedBy: "micheal",
  },
];

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const utils = trpc.useUtils();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload avatar");
    }

    const { filename } = await uploadResponse.json();
    await authClient.updateUser({ image: filename });
    await utils.postsRouter.findAll.refetch();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            {session?.user.image ? (
              <Image
                src={getImageUrl(session?.user?.image)}
                alt="Your Profile"
                className="w-14 h-14 rounded-full"
                width={60}
                height={60}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            <Button
              variant={"ghost"}
              size={"icon"}
              title="Change Avatar"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90"
              onClick={() => setShowAvatarModal(true)}
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{session?.user.email}</div>
            <div className="text-sm text-muted-foreground truncate">
              {session?.user.name}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Button
              variant={"ghost"}
              size={"icon"}
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-muted-foreground">
            Suggestions for you
          </h3>
        </div>

        <div className="space-y-3">
          {mockSuggestions.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <Image
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full"
                width={40}
                height={40}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{user.username}</div>
                {user.followedBy && (
                  <div className="text-xs text-muted-foreground">
                    Follwed by {user.followedBy}
                  </div>
                )}
              </div>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-primary hover:text-primary/90 text-xs"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <AvatarUpload
        open={showAvatarModal}
        onOpenChange={setShowAvatarModal}
        onSubmit={handleAvatarUpload}
        currentAvatar={session?.user.image}
      />
    </div>
  );
}
