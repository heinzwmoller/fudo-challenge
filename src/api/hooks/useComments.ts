import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../comments.api";
import type { Comment } from "../types";
import { queryClient } from "../../lib/queryClient";
import { queryKeys } from "../queryKeys";

export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.comments.list(postId),
    queryFn: async () => {
      const data = await getComments(postId);
      return data;
    },
    enabled: !!postId,
  });
}

const generateTempId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

const commentsQueryKey = (postId: string) => queryKeys.comments.list(postId);

export function useCreateComment(postId: string) {
  return useMutation({
    mutationFn: async (comment: Partial<Comment>): Promise<Comment> => {
      const data = await createComment(postId, comment);
      return data;
    },
    onMutate: async (comment) => {
      await queryClient.cancelQueries({
        queryKey: commentsQueryKey(postId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>(
        commentsQueryKey(postId)
      );

      const optimisticId = comment.id ?? generateTempId("optimistic-comment");
      const optimisticCreatedAt = comment.createdAt ?? new Date().toISOString();

      const optimisticComment: Comment = {
        id: optimisticId,
        content: comment.content ?? "",
        name: comment.name ?? "Anónimo",
        avatar: comment.avatar ?? "",
        parentId:
          comment.parentId === undefined ? null : (comment.parentId ?? null),
        createdAt: optimisticCreatedAt,
      };

      queryClient.setQueryData<Comment[]>(
        commentsQueryKey(postId),
        (current = []) => [...current, optimisticComment]
      );

      return { previousComments, optimisticId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          commentsQueryKey(postId),
          context.previousComments
        );
      }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData<Comment[]>(
        commentsQueryKey(postId),
        (current = []) =>
          current.map((item) =>
            context?.optimisticId && item.id === context.optimisticId
              ? data
              : item
          )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: commentsQueryKey(postId),
      });
    },
  });
}

export function useUpdateComment(postId: string) {
  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }): Promise<Comment> => {
      const data = await updateComment(postId, commentId, { content });
      return data;
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({
        queryKey: commentsQueryKey(postId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>(
        commentsQueryKey(postId)
      );

      queryClient.setQueryData<Comment[]>(
        commentsQueryKey(postId),
        (current) =>
          current
            ? current.map((item) =>
                item.id === commentId ? { ...item, content } : item
              )
            : current
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          commentsQueryKey(postId),
          context.previousComments
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Comment[]>(
        commentsQueryKey(postId),
        (current) =>
          current
            ? current.map((item) => (item.id === data.id ? data : item))
            : current
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: commentsQueryKey(postId),
      });
    },
  });
}

const pruneComments = (comments: Comment[], commentId: string) => {
  const idsToRemove = new Set<string>([commentId]);
  let added = true;

  while (added) {
    added = false;
    for (const comment of comments) {
      if (
        !idsToRemove.has(comment.id) &&
        comment.parentId &&
        idsToRemove.has(comment.parentId)
      ) {
        idsToRemove.add(comment.id);
        added = true;
      }
    }
  }

  return comments.filter((comment) => !idsToRemove.has(comment.id));
};

export function useDeleteComment(postId: string) {
  return useMutation({
    mutationFn: async ({ commentId }: { commentId: string }): Promise<void> => {
      await deleteComment(postId, commentId);
    },
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(postId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>(
        queryKeys.comments.list(postId)
      );

      queryClient.setQueryData<Comment[]>(
        queryKeys.comments.list(postId),
        (current) => (current ? pruneComments(current, commentId) : current)
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          queryKeys.comments.list(postId),
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(postId),
      });
    },
  });
}
