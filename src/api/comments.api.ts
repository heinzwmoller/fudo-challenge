import { api } from "./axios";
import type { Comment } from "./types";

export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/post/${postId}/comment`);
  return response.data;
};

export const createComment = async (
  postId: string,
  data: Partial<Comment>
): Promise<Comment> => {
  const response = await api.post<Comment>(`/post/${postId}/comment`, data);
  return response.data;
};

export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await api.delete<void>(`/post/${postId}/comment/${commentId}`);
};

export const updateComment = async (
  postId: string,
  commentId: string,
  data: Pick<Comment, "content">
): Promise<Comment> => {
  const response = await api.put<Comment>(
    `/post/${postId}/comment/${commentId}`,
    data
  );
  return response.data;
};
