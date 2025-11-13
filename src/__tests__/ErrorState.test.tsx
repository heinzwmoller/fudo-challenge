import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorState } from "@/components/ui";

describe("ErrorState", () => {
  it("renders message and calls onRetry", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Algo salió mal" onRetry={onRetry} />);
    expect(screen.getByText("Algo salió mal")).toBeDefined();
    fireEvent.click(screen.getByText("Reintentar"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
