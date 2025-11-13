import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useComments,
  useCreateComment,
  useDeletePost,
  usePost,
  useUpdatePost,
} from "@/api";
import { useAuth } from "@/features/auth";
import type { CommentWithReplies } from "../types";
import { buildCommentTree } from "../helpers/buildCommentTree";
import { serializeError } from "@/api/errorSerializer";

const getInitialLikes = (id: string) => {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }
  return (Math.abs(hash) % 300) + 1;
};

export function usePostDetails(postId: string | undefined) {
  const navigate = useNavigate();
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editPostErrorMessage, setEditPostErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [postCommentErrorMessage, setPostCommentErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [likes, setLikes] = useState(() =>
    postId ? getInitialLikes(postId) : 0
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    refetch: refetchPost,
  } = usePost(postId ?? "");
  const {
    data: comments,
    isLoading: isCommentsLoading,
    isFetching: isCommentsFetching,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
  } = useComments(postId ?? "");

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment(postId ?? "");
  const { mutate: updatePost, isPending: isUpdatingPost } = useUpdatePost();
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();
  const { user } = useAuth();

  const fallbackAuthor = {
    name: "Anonymous",
    avatar: "https://i.pravatar.cc/150?img=6",
  };

  const postErrorStatus = postError
    ? serializeError(postError).status
    : undefined;
  const isPostNotFound = postErrorStatus === 404;

  const commentsErrorStatus = commentsError
    ? serializeError(commentsError).status
    : undefined;
  const isCommentsNotFound = commentsErrorStatus === 404;

  const commentWithReplies: CommentWithReplies[] = buildCommentTree(
    comments ?? []
  );

  useEffect(() => {
    if (postId) {
      setLikes(getInitialLikes(postId));
      setHasLiked(false);
    }
  }, [postId]);

  const shareUrl = useMemo(() => {
    if (!postId) return "";
    if (typeof window !== "undefined") {
      return `${window.location.origin}/posts/${postId}`;
    }
    return `/posts/${postId}`;
  }, [postId]);

  const handleLike = () => {
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikes((current) => current + (nextLiked ? 1 : -1));
  };

  const handleShare = () => {
    setIsShareOpen(true);
    setIsCopied(false);
  };

  const handleCopyShareUrl = () => {
    if (!shareUrl) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          setIsCopied(true);
        },
        () => {
          setIsCopied(false);
        }
      );
    }
  };

  const handleCreateComment = (content: string) => {
    createComment(
      {
        content,
        name: user?.name ?? fallbackAuthor.name,
        avatar: user?.avatar ?? fallbackAuthor.avatar,
        parentId: null,
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setPostCommentErrorMessage(undefined);
        },
        onError: (err) => {
          const { message } = serializeError(err);
          setPostCommentErrorMessage(message);
        },
      }
    );
  };

  const cancelCreateComment = () => {
    setPostCommentErrorMessage(undefined);
  };

  const startEditPost = () => setIsEditingPost(true);
  const cancelEditPost = () => setIsEditingPost(false);
  const savePost = (title: string, content: string) => {
    if (!postId) return;
    updatePost(
      { id: postId, data: { title, content } },
      {
        onSuccess: () => {
          setEditPostErrorMessage(undefined);
          setIsEditingPost(false);
        },
        onError: (err) => {
          const { message } = serializeError(err);
          setEditPostErrorMessage(message);
        },
      }
    );
  };

  const openDeletePost = () => setIsDeleteOpen(true);
  const cancelDeletePost = () => {
    if (!isDeletingPost) setIsDeleteOpen(false);
  };
  const confirmDeletePost = () => {
    if (!postId) return;
    deletePost(
      { id: postId },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          navigate("/");
        },
      }
    );
  };

  return {
    post,
    commentWithReplies,
    isPostLoading,
    isPostError,
    isCommentsLoading,
    isCommentsFetching,
    isCommentsError,
    isPostNotFound,
    isCommentsNotFound,
    isCreatingComment,
    isUpdatingPost,
    isDeletingPost,
    isEditingPost,
    isDeleteOpen,
    editPostErrorMessage,
    postCommentErrorMessage,
    likes,
    hasLiked,
    shareUrl,
    isShareOpen,
    isCopied,
    handleCreateComment,
    cancelCreateComment,
    startEditPost,
    cancelEditPost,
    savePost,
    openDeletePost,
    cancelDeletePost,
    confirmDeletePost,
    handleLike,
    handleShare,
    handleCopyShareUrl,
    setIsShareOpen,
    refetchComments,
    refetchPost,
  };
}
