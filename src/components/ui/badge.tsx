import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "success" | "muted";

const variants: Record<Variant, string> = {
  default: "bg-primary/10 text-primary border-transparent",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  outline: "border-border text-foreground",
  success: "bg-success/12 text-success border-transparent",
  muted: "bg-muted text-muted-foreground border-transparent",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
