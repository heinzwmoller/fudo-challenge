import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../posts.api";
import type { Post } from "../types";
import { queryClient } from "../../lib/queryClient";
import { queryKeys } from "../queryKeys";

const generateTempId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

const postsListKey = queryKeys.posts.list();
const LIMIT = 20;

type PostsInfiniteData = InfiniteData<Post[]>;

const setPostsData = (
  updater: (pages: Post[][], pageParams: unknown[]) => Post[][]
) => {
  queryClient.setQueryData<PostsInfiniteData>(postsListKey, (current) => {
    if (!current) return current;

    const updatedPages = updater(
      current.pages.map((page) => [...page]),
      [...current.pageParams]
    );

    return {
      ...current,
      pages: updatedPages,
    };
  });
};

const getPostsData = () =>
  queryClient.getQueryData<PostsInfiniteData>(postsListKey);

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postsListKey,
    queryFn: async ({ pageParam }) => {
      const data = await getPosts({
        pageParam: pageParam ?? 1,
        limit: LIMIT,
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length < LIMIT) {
        return undefined;
      }
      return (lastPageParam ?? 1) + 1;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: async () => {
      const data = await getPostById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: async (post: Partial<Post>): Promise<Post> => {
      const data = await createPost(post);
      return data;
    },
    onMutate: async (post) => {
      await queryClient.cancelQueries({ queryKey: postsListKey });

      const previousData = getPostsData();

      const tempId = generateTempId("optimistic-post");
      const optimisticPost: Post = {
        id: tempId,
        title: post.title ?? "",
        content: post.content ?? "",
        name: post.name ?? "Anónimo",
        avatar: post.avatar ?? "",
        createdAt: post.createdAt ?? new Date().toISOString(),
      };

      if (!previousData) {
        queryClient.setQueryData<PostsInfiniteData>(postsListKey, {
          pageParams: [1],
          pages: [[optimisticPost]],
        });
      } else {
        setPostsData((pages) => {
          const [first, ...rest] = pages;
          const nextFirst = [optimisticPost, ...first].slice(0, LIMIT);
          return [nextFirst, ...rest];
        });
      }

      return { previousData, tempId };
    },
    onError: (error, _variables, context) => {
      console.error("Error al crear el post: ", error);
      if (context?.previousData) {
        queryClient.setQueryData(postsListKey, context.previousData);
      }
    },
    onSuccess: (data, _variables, context) => {
      if (context?.tempId) {
        setPostsData((pages) =>
          pages.map((page) =>
            page.map((post) => (post.id === context.tempId ? data : post))
          )
        );
      }
      queryClient.setQueryData<Post>(queryKeys.posts.detail(data.id), data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsListKey });
    },
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Post>;
    }): Promise<Post> => {
      const updated = await updatePost(id, data);
      return updated;
    },
    onMutate: async ({ id, data }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postsListKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(id) }),
      ]);

      const previousData = getPostsData();
      const previousPostDetail = queryClient.getQueryData<Post>(
        queryKeys.posts.detail(id)
      );

      setPostsData((pages) =>
        pages.map((page) =>
          page.map((post) => (post.id === id ? { ...post, ...data } : post))
        )
      );

      queryClient.setQueryData<Post>(queryKeys.posts.detail(id), (current) =>
        current ? { ...current, ...data } : current
      );

      return { previousData, previousPostDetail };
    },
    onError: (error, variables, context) => {
      console.error("Error al actualizar el post: ", error);
      if (context?.previousData) {
        queryClient.setQueryData(postsListKey, context.previousData);
      }
      if (context?.previousPostDetail) {
        queryClient.setQueryData<Post>(
          queryKeys.posts.detail(variables.id),
          context.previousPostDetail
        );
      }
    },
    onSuccess: (data) => {
      setPostsData((pages) =>
        pages.map((page) =>
          page.map((post) => (post.id === data.id ? data : post))
        )
      );
      queryClient.setQueryData<Post>(queryKeys.posts.detail(data.id), data);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: postsListKey });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.detail(variables.id),
        });
      }
    },
  });
}

export function useDeletePost() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }): Promise<void> => {
      await deletePost(id);
    },
    onMutate: async ({ id }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postsListKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(id) }),
      ]);

      const previousData = getPostsData();
      const previousPostDetail = queryClient.getQueryData<Post>(
        queryKeys.posts.detail(id)
      );

      setPostsData((pages) =>
        pages.map((page) => page.filter((post) => post.id !== id))
      );
      queryClient.removeQueries({
        queryKey: queryKeys.posts.detail(id),
      });

      return { previousData, previousPostDetail };
    },
    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(postsListKey, context.previousData);
      }
      if (context?.previousPostDetail) {
        queryClient.setQueryData<Post>(
          queryKeys.posts.detail(variables.id),
          context.previousPostDetail
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: postsListKey });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.detail(variables.id),
        });
      }
    },
  });
}
