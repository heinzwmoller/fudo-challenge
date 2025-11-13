import type { Comment } from "../../api/types";

export type CommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};
