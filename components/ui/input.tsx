import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md border border-border bg-black/20 px-4 text-sm text-foreground transition-colors duration-200 placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-[#3b82f680] sm:text-base",
        className
      )}
      {...props}
    />
  );
}
