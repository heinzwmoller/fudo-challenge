import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui";
import { Avatar } from "../../../components/ui";
import type { Post } from "@/api/types";
import { formatRelativeTime } from "../../../lib/utils";
import { OptionsMenu } from "./OptionsMenu";
import {
  ArrowTopRightOnSquareIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { PostInput } from "./PostInput";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useDeletePost, useUpdatePost } from "@/api";
import { serializeError } from "@/api/errorSerializer";
import { SharePostModal } from "./SharePostModal";
import { LikeButton } from "./LikeButton";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { mutate: updatePost, isPending: isUpdatingPost } = useUpdatePost();
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const handleStartEdit = () => {
    setEditErrorMessage(undefined);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (isUpdatingPost) return;
    setIsEditing(false);
    setEditErrorMessage(undefined);
  };

  const handleSavePost = (title: string, content: string) => {
    updatePost(
      { id: post.id, data: { title, content } },
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

  const handleOpenDelete = () => {
    setDeleteErrorMessage(undefined);
    setIsDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    if (isDeletingPost) return;
    setIsDeleteOpen(false);
    setDeleteErrorMessage(undefined);
  };

  const handleConfirmDelete = () => {
    deletePost(
      { id: post.id },
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

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/posts/${post.id}`;
    }
    return `/posts/${post.id}`;
  }, [post.id]);

  const handleShare = () => {
    setIsShareOpen(true);
    setIsCopied(false);
  };

  const handleCopy = () => {
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

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={post.avatar} alt={post.name} size="sm" />
          <div className="flex flex-col gap-1 text-slate-500 sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
            <span className="font-semibold text-slate-900">{post.name}</span>
            <span className="text-xs text-slate-400 sm:hidden">
              {formatRelativeTime(post.createdAt)}
            </span>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-slate-300">•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>
        {!isEditing && (
          <OptionsMenu onEdit={handleStartEdit} onDelete={handleOpenDelete} />
        )}
      </div>

      {isEditing ? (
        <div className="mb-3">
          <PostInput
            mode="edit"
            initialTitle={post.title}
            initialContent={post.content}
            onSubmit={handleSavePost}
            onCancel={handleCancelEdit}
            isSubmitting={isUpdatingPost}
            errorMessage={editErrorMessage}
            submitText="Guardar"
            cancelText="Cancelar"
          />
        </div>
      ) : (
        <>
          <Link to={`/posts/${post.id}`}>
            <h2 className="text-xl font-bold mb-2 text-slate-900 hover:text-indigo-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-600 line-clamp-3">{post.content}</p>
          </Link>

          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3">
            <LikeButton targetId={post.id} />
            <Link
              to={`/posts/${post.id}`}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              <ChatBubbleOvalLeftIcon className="w-5 h-5" />
              <span>Comentar</span>
            </Link>
            <button
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              onClick={handleShare}
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        open={isDeleteOpen}
        title="Eliminar post"
        content={
          <div>
            <p>
              ¿Seguro que deseas eliminar este post? Esta acción no se puede
              deshacer.
            </p>
            {deleteErrorMessage && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {deleteErrorMessage}
              </p>
            )}
          </div>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        isConfirming={isDeletingPost}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <SharePostModal
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        shareUrl={shareUrl}
        isCopied={isCopied}
        onCopy={handleCopy}
      />
    </Card>
  );
}
