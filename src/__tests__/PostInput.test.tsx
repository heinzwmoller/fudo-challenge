import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PostInput } from "@/features/posts/components/PostInput";

describe("PostInput", () => {
  it("shows inline error message when provided", () => {
    const onSubmit = vi.fn();
    render(
      <PostInput
        onSubmit={onSubmit}
        isSubmitting={false}
        errorMessage="Error de validación"
        mode="edit"
      />
    );
    expect(screen.getByText("Error de validación")).toBeInTheDocument();
  });

  it("disables submit when title/content empty", () => {
    const onSubmit = vi.fn();
    render(<PostInput onSubmit={onSubmit} isSubmitting={false} mode="edit" />);
    expect(screen.getByText("Guardar")).toBeDisabled();
  });
});
