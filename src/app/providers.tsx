import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { queryClient } from "../lib/queryClient";
import { AuthProvider } from "@/features/auth";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
}
