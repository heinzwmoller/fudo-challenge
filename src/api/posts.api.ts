import { api } from "./axios";
import type { Post } from "./types";

const DEFAULT_LIMIT = 20;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_ORDER = "desc";

export const getPosts = async ({
  pageParam = 1,
  limit = DEFAULT_LIMIT,
}: {
  pageParam?: number;
  limit?: number;
} = {}): Promise<Post[]> => {
  const response = await api.get<Post[]>(
    `/post?limit=${limit}&page=${pageParam}&sortBy=${DEFAULT_SORT_BY}&order=${DEFAULT_ORDER}`
  );
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get<Post>(`/post/${id}`);
  return response.data;
};

export const createPost = async (data: Partial<Post>): Promise<Post> => {
  const response = await api.post<Post>("/post", data);
  return response.data;
};

export const updatePost = async (
  id: string,
  data: Partial<Post>
): Promise<Post> => {
  const response = await api.put<Post>(`/post/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete<void>(`/post/${id}`);
};
