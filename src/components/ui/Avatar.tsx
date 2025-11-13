import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
}

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?img=6";

export function Avatar({ src, alt, size = "md" }: AvatarProps) {
  const avatarClassName = cn(
    "rounded-full",
    size === "sm" ? "w-6 h-6" : size === "md" ? "w-10 h-10" : "w-12 h-12"
  );
  const safeSrc =
    typeof src === "string" && src.trim() !== "" ? src : FALLBACK_AVATAR;
  return <img src={safeSrc} alt={alt} className={avatarClassName} />;
}
