import Image from "next/image";
import { Card } from "../ui/card";

interface Story {
  id: string;
  username: string;
  avatar: string;
}

const mockStories: Story[] = [
  {
    id: "1",
    username: "johndoe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  },
  {
    id: "2",
    username: "janedoe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  },
  {
    id: "3",
    username: "micheal",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  },
  {
    id: "4",
    username: "jhonny",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  },
];

export function Stories() {
  return (
    <Card className="p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {mockStories.map((story) => (
          <div
            className="flex flex-col items-center space-y-1 shrink-0"
            key={story.id}
          >
            <div className="relative">
              <div className="p-0.8 rounded-full bg-linear-to-r from-yellow-400 to-fuchsia-600 bg-gray-200">
                <Image
                  src={story.avatar}
                  alt={story.username}
                  className="rounded-full object-cover border-2 border-white"
                  width={64}
                  height={64}
                />
              </div>
            </div>
            <span
              className="text-xs text-center w-16 truncate"
              title={story.username}
            >
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
