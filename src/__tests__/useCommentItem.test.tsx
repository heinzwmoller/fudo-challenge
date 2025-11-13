import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCommentItem } from "@/features/posts/hooks/useCommentItem";

const createCommentMutate = vi.fn(
  (
    _variables: unknown,
    options?: { onError?: (err: Error) => void; onSuccess?: () => void }
  ) => {
    options?.onError?.(new Error("Error al crear comentario"));
  }
);

vi.mock("@/api", () => ({
  useCreateComment: vi.fn(() => ({
    mutate: createCommentMutate,
    isPending: false,
  })),
  useUpdateComment: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useDeleteComment: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("@/features/auth", () => ({
  useAuth: () => ({
    user: {
      email: "tester@example.com",
      name: "Tester",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
  }),
}));

describe("useCommentItem", () => {
  it("limpia el mensaje de error al cancelar una respuesta", () => {
    const { result } = renderHook(() => useCommentItem("post-1", "comment-1"));

    act(() => {
      result.current.openReply();
    });

    act(() => {
      result.current.submitReply("Contenido de prueba");
    });

    expect(result.current.replyErrorMessage).toBe("Error al crear comentario");

    act(() => {
      result.current.cancelReply();
    });

    expect(result.current.replyErrorMessage).toBeUndefined();
    expect(result.current.showReplyInput).toBe(false);
  });
});
