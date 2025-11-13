import { useState } from "react";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const DEFAULT_RANGE = 300;

const generateInitialCount = (id: string, range: number) => {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }
  return (Math.abs(hash) % range) + 1;
};

interface LikeButtonProps {
  targetId: string;
  initialRange?: number;
  iconSize?: "sm" | "md";
  className?: string;
}

export function LikeButton({
  targetId,
  initialRange = DEFAULT_RANGE,
  iconSize = "md",
  className = "",
}: LikeButtonProps) {
  const [likes, setLikes] = useState(() =>
    generateInitialCount(targetId, initialRange)
  );
  const [hasLiked, setHasLiked] = useState(false);

  const handleToggleLike = () => {
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikes((current) => current + (nextLiked ? 1 : -1));
  };

  const iconClass =
    iconSize === "sm" ? "w-4 h-4" : iconSize === "md" ? "w-5 h-5" : "w-6 h-6";

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      className={`flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors ${className}`}
    >
      {hasLiked ? (
        <HeartSolidIcon className={`${iconClass} text-gray-700`} />
      ) : (
        <HeartOutlineIcon className={iconClass} />
      )}
      <span>{likes}</span>
    </button>
  );
}
