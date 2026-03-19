"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type ButtonVariant = "default" | "secondary" | "ghost" | "destructive";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-foreground text-background hover:opacity-90",
  secondary: "bg-muted text-foreground hover:opacity-90",
  ghost: "bg-transparent hover:bg-muted",
  destructive: "bg-red-600 text-white hover:opacity-90"
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", asChild = false, type = "button", ...props },
  ref
) {
  const Comp: React.ElementType = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

