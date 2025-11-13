import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui";

export function PostCardSkeleton() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
}
