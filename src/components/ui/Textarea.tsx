import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn("w-full p-2 rounded-md border border-gray-300", className)}
      {...props}
      ref={ref}
    />
  );
});

Textarea.displayName = "Textarea";
