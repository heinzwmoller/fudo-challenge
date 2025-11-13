export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    list: () => ["posts"] as const,
    detail: (id: string) => ["post", id] as const,
  },
  comments: {
    list: (postId: string) => ["comments", postId] as const,
  },
};
