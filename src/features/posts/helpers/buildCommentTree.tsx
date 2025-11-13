import type { CommentWithReplies } from "../types";
import type { Comment } from "@/api/types";

export function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  const orphanedIds = new Set<string>();

  comments.forEach((comment) => {
    const node = commentMap.get(comment.id)!;

    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      } else {
        orphanedIds.add(comment.id);
      }
    } else {
      rootComments.push(node);
    }
  });

  if (orphanedIds.size > 0) {
    orphanedIds.forEach((id) => commentMap.delete(id));
    rootComments.splice(
      0,
      rootComments.length,
      ...rootComments.filter((comment) => !orphanedIds.has(comment.id))
    );
  }

  const sortByCreatedAt = (nodes: CommentWithReplies[]) => {
    nodes.sort((a, b) => {
      const timeA = Date.parse(a.createdAt) || 0;
      const timeB = Date.parse(b.createdAt) || 0;
      return timeA - timeB;
    });
    nodes.forEach((node) => {
      if (node.replies.length > 0) {
        sortByCreatedAt(node.replies);
      }
    });
  };

  sortByCreatedAt(rootComments);

  return rootComments;
}
