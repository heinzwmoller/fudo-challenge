import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostsList from "@/features/posts/pages/PostsList";

const mockUsePostsList = vi.fn();

vi.mock("@/features/posts/hooks", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/posts/hooks")>();
  return {
    ...actual,
    usePostsList: () => mockUsePostsList(),
  };
});

const baseHookResult = {
  posts: [
    {
      id: "1",
      title: "Primer post",
      content: "Contenido del primer post",
      name: "Autor Uno",
      avatar: "",
      createdAt: new Date().toISOString(),
    },
  ],
  isCreatingPost: false,
  handleCreatePost: vi.fn(),
  isLoadingPosts: false,
  isPostsError: false,
  refetchPosts: vi.fn(),
  hasMorePosts: false,
  loadMorePosts: vi.fn(),
  isLoadingMorePosts: false,
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderComponent = () => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PostsList />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("PostsList", () => {
  beforeEach(() => {
    mockUsePostsList.mockReturnValue(baseHookResult);
  });

  it("renderiza los posts obtenidos", () => {
    renderComponent();
    expect(screen.getByText("Primer post")).toBeInTheDocument();
  });

  it("muestra el botón de cargar más cuando hay más páginas y lo invoca al hacer click", () => {
    const loadMorePosts = vi.fn();
    mockUsePostsList.mockReturnValue({
      ...baseHookResult,
      hasMorePosts: true,
      loadMorePosts,
    });

    renderComponent();
    const button = screen.getByRole("button", {
      name: "Quiero más posts! ...",
    });
    fireEvent.click(button);

    expect(loadMorePosts).toHaveBeenCalledTimes(1);
  });
});
