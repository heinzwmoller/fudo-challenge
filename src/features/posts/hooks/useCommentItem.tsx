import { useState } from "react";
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/api";
import { serializeError } from "@/api/errorSerializer";
import { useAuth } from "@/features/auth";

export function useCommentItem(postId: string, commentId: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyErrorMessage, setReplyErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [editErrorMessage, setEditErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<
    string | undefined
  >(undefined);

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment(postId);
  const { mutate: updateComment, isPending: isUpdatingComment } =
    useUpdateComment(postId);
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment(postId);
  const { user } = useAuth();

  const fallbackAuthor = {
    name: "Anonymous",
    avatar: "https://i.pravatar.cc/150?img=6",
  };

  const openReply = () => setShowReplyInput(true);
  const cancelReply = () => {
    setShowReplyInput(false);
    setReplyErrorMessage(undefined);
  };
  const submitReply = (content: string) => {
    setReplyErrorMessage(undefined);
    createComment(
      {
        content,
        name: user?.name ?? fallbackAuthor.name,
        avatar: user?.avatar ?? fallbackAuthor.avatar,
        parentId: commentId,
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setReplyErrorMessage(undefined);
          setShowReplyInput(false);
        },
        onError: (err) => {
          const { message } = serializeError(err);
          setReplyErrorMessage(message);
        },
      }
    );
  };

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => setIsEditing(false);
  const saveEdit = (newContent: string) => {
    setEditErrorMessage(undefined);
    updateComment(
      { commentId, content: newContent },
      {
        onSuccess: () => {
          setEditErrorMessage(undefined);
          setIsEditing(false);
        },
        onError: (err) => {
          const { message } = serializeError(err);
          setEditErrorMessage(message);
        },
      }
    );
  };

  const openDelete = () => {
    setDeleteErrorMessage(undefined);
    setIsDeleteOpen(true);
  };
  const cancelDelete = () => {
    if (!isDeletingComment) {
      setIsDeleteOpen(false);
      setDeleteErrorMessage(undefined);
    }
  };
  const confirmDelete = () => {
    deleteComment(
      { commentId },
      {
        onSuccess: () => {
          setDeleteErrorMessage(undefined);
          setIsDeleteOpen(false);
        },
        onError: (err) => {
          const { message } = serializeError(err);
          setDeleteErrorMessage(message);
        },
      }
    );
  };

  return {
    showReplyInput,
    openReply,
    cancelReply,
    submitReply,
    isCreatingComment,
    replyErrorMessage,
    isEditing,
    startEdit,
    cancelEdit,
    saveEdit,
    isUpdatingComment,
    editErrorMessage,
    isDeleteOpen,
    openDelete,
    cancelDelete,
    confirmDelete,
    isDeletingComment,
    deleteErrorMessage,
  };
}
