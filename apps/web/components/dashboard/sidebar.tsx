"use client";

import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";
import Image from "next/image";
import { ThemeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Image
            src={
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
            }
            alt="Your Profile"
            className="w-14 h-14 rounded-full"
            width={60}
            height={60}
          />
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
    </div>
  );
}
