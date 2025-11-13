import { describe, it, expect } from "vitest";
import type { Comment } from "@/api/types";
import { buildCommentTree } from "@/features/posts/helpers/buildCommentTree";

describe("buildCommentTree", () => {
  it("should build a nested tree from flat comments", () => {
    const comments: Comment[] = [
      {
        id: "1",
        content: "root 1",
        name: "n1",
        avatar: "",
        parentId: null,
        createdAt: "t1",
      },
      {
        id: "2",
        content: "root 2",
        name: "n2",
        avatar: "",
        parentId: null,
        createdAt: "t2",
      },
      {
        id: "3",
        content: "child of 1",
        name: "n3",
        avatar: "",
        parentId: "1",
        createdAt: "t3",
      },
      {
        id: "4",
        content: "child of 3",
        name: "n4",
        avatar: "",
        parentId: "3",
        createdAt: "t4",
      },
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(2);
    const first = tree[0];
    expect(first.id).toBe("1");
    expect(first.replies).toHaveLength(1);
    expect(first.replies[0].id).toBe("3");
    expect(first.replies[0].replies[0].id).toBe("4");
  });

  it("should ignore comments whose parent no longer exists", () => {
    const comments: Comment[] = [
      {
        id: "root",
        content: "root",
        name: "root",
        avatar: "",
        parentId: null,
        createdAt: "t1",
      },
      {
        id: "child",
        content: "child",
        name: "child",
        avatar: "",
        parentId: "missing-parent",
        createdAt: "t2",
      },
      {
        id: "grandchild",
        content: "grandchild",
        name: "grandchild",
        avatar: "",
        parentId: "child",
        createdAt: "t3",
      },
    ];

    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("root");
    expect(tree[0].replies).toHaveLength(0);
  });
});
