import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { PostCard } from "../components/PostCard";
import type { Post } from "@/api/types";
import { PostInput } from "../components/PostInput";
import { usePostsList } from "../hooks";
import { Button, ErrorState } from "@/components/ui";
import { PostCardSkeleton } from "../components/PostCardSkeleton";

export default function PostsList() {
  const {
    posts,
    isCreatingPost,
    handleCreatePost,
    isLoadingPosts,
    isPostsError,
    refetchPosts,
    hasMorePosts,
    loadMorePosts,
    isLoadingMorePosts,
  } = usePostsList();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <PostInput onSubmit={handleCreatePost} isSubmitting={isCreatingPost} />
      </div>

      {isPostsError && (
        <div className="mb-4">
          <ErrorState
            message="No se pudieron cargar los posts."
            onRetry={() => refetchPosts()}
          />
        </div>
      )}
      <div className="flex flex-col gap-8">
        {isLoadingPosts && posts.length === 0 && (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        )}
        {posts.length === 0 && !isLoadingPosts ? (
          <div className="text-center text-gray-500 py-8">
            No hay posts aún. Crea uno nuevo!
          </div>
        ) : (
          <>
            {posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {isLoadingMorePosts && (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            )}
            {hasMorePosts && !isLoadingMorePosts && (
              <div className="flex justify-center py-4">
                <Button onClick={loadMorePosts} variant="outline">
                  Quiero más posts! ...
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 shadow-lg"
          variant="primary"
          aria-label="Volver arriba"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
