import { QueryClient } from "@tanstack/react-query";
import { serializeError } from "@/api/errorSerializer";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const { status } = serializeError(error);
        if (!status) return failureCount < 2;
        if (status >= 500) return failureCount < 2;
        return false;
      },
      refetchOnWindowFocus: false,
      throwOnError: false,
    },
  },
});
