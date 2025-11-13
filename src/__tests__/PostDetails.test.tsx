import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PostDetails from "@/features/posts/pages/PostDetails";

const mockUsePostDetails = vi.fn();

vi.mock("@/features/posts/hooks", () => ({
  usePostDetails: (...args: unknown[]) => mockUsePostDetails(...args),
}));

const baseHookResult = {
  post: {
    id: "post-1",
    title: "Título de prueba",
    content: "Contenido de prueba",
    name: "Autor",
    avatar: "https://example.com/avatar.png",
    createdAt: new Date().toISOString(),
  },
  commentWithReplies: [],
  isPostLoading: false,
  isPostError: false,
  isCommentsLoading: false,
  isCommentsError: false,
  isCommentsFetching: false,
  isCreatingComment: false,
  isUpdatingPost: false,
  isDeletingPost: false,
  isEditingPost: false,
  isDeleteOpen: false,
  editPostErrorMessage: undefined,
  postCommentErrorMessage: undefined,
  cancelCreateComment: vi.fn(),
  handleCreateComment: vi.fn(),
  startEditPost: vi.fn(),
  cancelEditPost: vi.fn(),
  savePost: vi.fn(),
  openDeletePost: vi.fn(),
  cancelDeletePost: vi.fn(),
  confirmDeletePost: vi.fn(),
  refetchPost: vi.fn(),
  refetchComments: vi.fn(),
};

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={["/posts/post-1"]}>
      <Routes>
        <Route path="/posts/:postId" element={<PostDetails />} />
      </Routes>
    </MemoryRouter>
  );

describe("PostDetails", () => {
  beforeEach(() => {
    mockUsePostDetails.mockReturnValue({ ...baseHookResult });
  });

  it("muestra el estado de error de comentarios y permite reintentar", () => {
    const refetchComments = vi.fn();
    mockUsePostDetails.mockReturnValue({
      ...baseHookResult,
      isCommentsError: true,
      refetchComments,
    });

    renderWithRouter();

    expect(
      screen.getByText("No se pudieron cargar los comentarios.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reintentar"));

    expect(refetchComments).toHaveBeenCalledTimes(1);
  });
});
