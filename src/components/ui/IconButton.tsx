import { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label = "", className, ...props }, ref) => {
    const iconButtonClassName = cn(
      "rounded-full transition-colors flex items-center",
      className
    );

    return (
      <button ref={ref} className={iconButtonClassName} {...props}>
        {label && <span className="text-sm font-medium mx-2">{label}</span>}
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
