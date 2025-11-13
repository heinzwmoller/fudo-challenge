import { useCreatePost, usePosts, type Post } from "@/api";
import { useAuth } from "@/features/auth";

export function usePostsList() {
  const {
    data,
    isLoading,
    isError: isPostsError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = usePosts();
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();
  const { user } = useAuth();

  const fallbackAuthor = {
    name: "Anonymous",
    avatar: "https://i.pravatar.cc/150?img=6",
  };

  const handleCreatePost = (title: string, content: string) => {
    createPost({
      title,
      content,
      name: user?.name ?? fallbackAuthor.name,
      avatar: user?.avatar ?? fallbackAuthor.avatar,
      createdAt: new Date().toISOString(),
    } satisfies Partial<Post>);
  };

  const posts = data?.pages.flat() ?? [];
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    posts,
    isLoadingPosts: isLoading && !data,
    isPostsError,
    refetchPosts: refetch,
    isCreatingPost,
    handleCreatePost,
    hasMorePosts: Boolean(hasNextPage),
    loadMorePosts: handleLoadMore,
    isLoadingMorePosts: isFetchingNextPage,
    isRefreshingPosts: isRefetching,
  };
}
