import { Skeleton } from "@/components/ui";

export function CommentSkeleton({ depth = 0 }: { depth?: number }) {
  return (
    <div style={{ marginLeft: depth > 0 ? 30 : 0 }} className="mb-4 flex gap-3">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
