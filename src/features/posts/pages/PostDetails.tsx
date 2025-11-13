import { useParams } from "react-router-dom";
import NotFound from "@/features/errors/pages/NotFound";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui";
import { CommentTree } from "../components/CommentTree";
import { CommentSkeleton } from "../components/CommentSkeleton";
import { NavigateBackIconButton } from "../components/NavigateBackIconButton";
import { OptionsMenu } from "../components/OptionsMenu";
import { formatRelativeTime } from "@/lib/utils";
import { CommentInput } from "../components/CommentInput";
import { PostInput } from "../components/PostInput";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ErrorState } from "@/components/ui";
import { usePostDetails } from "../hooks";
import {
  ArrowTopRightOnSquareIcon,
  HeartIcon as HeartOutlineIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { SharePostModal } from "../components/SharePostModal";

export default function PostDetails() {
  const { postId } = useParams();
  const {
    post,
    commentWithReplies,
    isPostLoading,
    isPostError,
    isPostNotFound,
    isCommentsLoading,
    isCommentsError,
    isCommentsNotFound,
    isCommentsFetching,
    isCreatingComment,
    isUpdatingPost,
    isDeletingPost,
    isEditingPost,
    isDeleteOpen,
    editPostErrorMessage,
    postCommentErrorMessage,
    cancelCreateComment,
    handleCreateComment,
    startEditPost,
    cancelEditPost,
    savePost,
    openDeletePost,
    cancelDeletePost,
    confirmDeletePost,
    likes,
    hasLiked,
    shareUrl,
    isShareOpen,
    isCopied,
    handleLike,
    handleShare,
    handleCopyShareUrl,
    setIsShareOpen,
    refetchPost,
    refetchComments,
  } = usePostDetails(postId);

  const showCommentsSkeleton =
    isCommentsLoading && commentWithReplies.length === 0;
  const shouldShowCommentsError = isCommentsError && !isCommentsNotFound;

  if (isPostLoading) {
    return (
      <div className="flex gap-3">
        <div className="w-6" />
        <div className="flex-1">
          <div className="animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="h-5 w-64 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-80 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isPostNotFound) {
    return <NotFound />;
  }

  if (isPostError) {
    return (
      <div className="p-4">
        <ErrorState
          message="No se pudo cargar el post."
          onRetry={() => refetchPost()}
        />
      </div>
    );
  }
  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="flex gap-3">
      <div>
        <NavigateBackIconButton />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={post.avatar} alt={post.name} size="md" />
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">
                    {post.name}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isEditingPost && (
                  <OptionsMenu
                    onEdit={startEditPost}
                    onDelete={openDeletePost}
                  />
                )}
              </div>
            </div>

            {!isEditingPost ? (
              <>
                <h1 className="text-2xl font-semibold">{post.title}</h1>
                <p className="text-slate-600">{post.content}</p>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleLike}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {hasLiked ? (
                      <HeartSolidIcon className="w-5 h-5 text-gray-700" />
                    ) : (
                      <HeartOutlineIcon className="w-5 h-5" />
                    )}
                    <span>{likes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </>
            ) : (
              <PostInput
                mode="edit"
                initialTitle={post.title}
                initialContent={post.content}
                isSubmitting={isUpdatingPost}
                errorMessage={editPostErrorMessage}
                onSubmit={(title, content) => savePost(title, content)}
                onCancel={cancelEditPost}
                submitText="Guardar"
                cancelText="Cancelar"
              />
            )}
          </div>
        </Card>
        <CommentInput
          mode="post"
          onSubmit={handleCreateComment}
          onCancel={cancelCreateComment}
          isSubmitting={isCreatingComment}
          errorMessage={postCommentErrorMessage}
          placeholder="Escribe tu respuesta..."
        />
        {shouldShowCommentsError && (
          <div className="mt-2">
            <ErrorState
              message="No se pudieron cargar los comentarios."
              onRetry={() => refetchComments()}
            />
          </div>
        )}
        {showCommentsSkeleton && !shouldShowCommentsError ? (
          <div className="mt-2">
            <CommentSkeleton />
            <CommentSkeleton depth={1} />
            <CommentSkeleton />
          </div>
        ) : (
          <div className="mt-2">
            {commentWithReplies.length === 0 &&
            !isCommentsFetching &&
            !shouldShowCommentsError ? (
              <div className="text-sm text-gray-500 px-1 text-center">
                Nadie ha comentado aun. Sé el primero en comentar!
              </div>
            ) : (
              commentWithReplies.map((comment) => (
                <CommentTree key={comment.id} comment={comment} />
              ))
            )}
          </div>
        )}
      </div>
      <ConfirmModal
        open={isDeleteOpen}
        title="Eliminar post"
        content="¿Seguro que deseas eliminar este post? Esta acción no se puede deshacer."
        onConfirm={confirmDeletePost}
        onCancel={cancelDeletePost}
        isConfirming={isDeletingPost}
      />
      <SharePostModal
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        shareUrl={shareUrl}
        isCopied={isCopied}
        onCopy={handleCopyShareUrl}
      />
    </div>
  );
}
