import { trpc } from "@/lib/trpc/client";
import Comments from "./comments";
import { authClient } from "@/lib/auth/client";

interface PostComments {
  postId: number;
  onAddComment: (postId: number, text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function PostComments({
  postId,
  onAddComment,
  onDeleteComment,
}: PostComments) {
  const { data: comments } = trpc.commentsRouter.findByPostId.useQuery({
    postId,
  });
  const { data: session } = authClient.useSession();

  return (
    <Comments
      comments={comments || []}
      currentUserId={session?.user?.id}
      onAddComment={(text) => onAddComment(postId, text)}
      onDeleteComment={onDeleteComment}
    />
  );
}
