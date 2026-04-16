import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "default" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  default: "h-12 px-5 text-sm sm:text-base",
  lg: "h-14 px-6 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[#00d992]/60 bg-surface text-accent-soft shadow-panel hover:border-accent hover:bg-surface-soft hover:text-accent",
  secondary:
    "border border-border bg-surface text-foreground shadow-panel hover:border-accent/40 hover:bg-surface-soft",
  outline:
    "border border-border bg-transparent text-muted hover:border-accent/50 hover:text-foreground",
  ghost:
    "border border-transparent bg-transparent text-subtle hover:bg-white/5 hover:text-foreground",
};

export function Button({
  className,
  size = "default",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f680] disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
