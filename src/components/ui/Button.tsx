import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  className,
  children,
  variant = "primary",
  type = "button",
  ...rest
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2";

  const variantClasses = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    secondary: "bg-gray-700 text-white hover:bg-gray-800",
  } satisfies Record<ButtonVariant, string>;

  const buttonClassName = cn(baseClasses, variantClasses[variant], className);

  return (
    <button type={type} className={buttonClassName} {...rest}>
      {children}
    </button>
  );
}
