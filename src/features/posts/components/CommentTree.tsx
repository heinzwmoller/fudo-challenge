import { memo } from "react";
import { Avatar } from "@/components/ui";
import type { CommentWithReplies } from "../types";
import { CommentInput } from "./CommentInput";
import { formatRelativeTime } from "@/lib/utils";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { OptionsMenu } from "./OptionsMenu";
import { EditCommentInput } from "./EditCommentInput";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useCommentItem } from "../hooks/useCommentItem";
import {
  useCommentThreadLayout,
  type CommentThreadLayoutConfig,
} from "../hooks/useCommentThreadLayout";
import { LikeButton } from "./LikeButton";

interface CommentTreeProps {
  comment: CommentWithReplies;
  depth?: number;
}
export const CommentTree = memo(CommentTreeInner);

const THREAD_VISUAL_CONFIG: CommentThreadLayoutConfig = Object.freeze({
  indentPx: 28,
  guideColor: "rgb(209 213 219)",
  guideWidthPx: 1,
  cornerRadiusPx: 10,
  avatarSizePx: 40,
  horizontalOffsetPx: 0,
});

function CommentTreeInner({ comment, depth = 0 }: CommentTreeProps) {
  const { postId: postIdFromParams } = useParams();
  const postId = postIdFromParams ?? "";

  const {
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
  } = useCommentItem(postId, comment.id);

  const hasReplies = comment.replies.length > 0;

  const layout = useCommentThreadLayout({
    hasReplies,
    depth,
    config: THREAD_VISUAL_CONFIG,
  });

  if (!postIdFromParams) {
    return <div>No se encontró el post</div>;
  }

  return (
    <article
      ref={layout.rootRef}
      className="relative"
      data-testid="comment-root"
      data-comment-id={comment.id}
      style={layout.nodeStyle}
    >
      {layout.hasVerticalGuide && layout.verticalStyle && (
        <span
          data-testid="vertical-line"
          className="absolute block rounded-full pointer-events-none"
          style={layout.verticalStyle}
        />
      )}

      <div className="relative mb-4 flex gap-3">
        {depth > 0 && (
          <span
            data-testid="elbow"
            className="absolute box-border pointer-events-none"
            style={layout.elbowStyle}
          />
        )}

        <div className="flex-shrink-0 relative">
          <div className="relative z-20">
            <div data-testid="avatar-wrap" ref={layout.avatarRef}>
              <Avatar src={comment.avatar} alt={comment.name} />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 ">
              <span className="font-semibold text-gray-900 ">
                {comment.name}
              </span>
              <span>•</span>
              <span>{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <div>
              <OptionsMenu onEdit={startEdit} onDelete={openDelete} />
            </div>
          </div>

          {!isEditing ? (
            <p className="text-gray-700 mb-2">{comment.content}</p>
          ) : (
            <div className="mb-2">
              <EditCommentInput
                initialValue={comment.content}
                onSubmit={(value) => saveEdit(value)}
                onCancel={cancelEdit}
                isSubmitting={isUpdatingComment}
                errorMessage={editErrorMessage}
              />
            </div>
          )}

          {!isEditing && (
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
              <LikeButton
                targetId={comment.id}
                initialRange={150}
                iconSize="sm"
              />
              <button
                onClick={openReply}
                className="flex items-center gap-2 hover:text-gray-700"
              >
                <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                <span>Responder</span>
              </button>
            </div>
          )}

          {showReplyInput && (
            <div className="mt-2 mb-3">
              <CommentInput
                mode="reply"
                onSubmit={submitReply}
                onCancel={cancelReply}
                isSubmitting={isCreatingComment}
                placeholder="Escribe tu respuesta..."
                autoFocus
                errorMessage={replyErrorMessage}
              />
            </div>
          )}
        </div>
      </div>

      {hasReplies && (
        <div
          ref={layout.repliesRef}
          className="comment-children relative flex flex-col gap-4"
          data-testid="replies"
        >
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="relative comment-child"
              data-testid="comment-child"
            >
              <CommentTree comment={reply} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={isDeleteOpen}
        title="Eliminar comentario"
        content={
          <div>
            <p>
              ¿Estás seguro de eliminar este comentario? Esta acción no se puede
              deshacer.
            </p>
            {deleteErrorMessage && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {deleteErrorMessage}
              </p>
            )}
          </div>
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isConfirming={isDeletingComment}
      />
    </article>
  );
}
