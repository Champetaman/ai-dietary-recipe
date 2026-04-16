import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  tone?: "glass" | "solid" | "inset";
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "p-5",
  md: "p-6",
  lg: "p-7",
};

const toneClasses = {
  glass: "shell-frame bg-surface/90",
  solid: "border border-border bg-surface shadow-panel",
  inset: "border border-border bg-black/30 shadow-panel",
};

export function Card({
  children,
  className,
  interactive = false,
  padding = "md",
  tone = "glass",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl text-foreground transition-all duration-300",
        paddingClasses[padding],
        toneClasses[tone],
        interactive &&
          "hover:border-accent/60 hover:shadow-float motion-reduce:hover:shadow-panel",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
