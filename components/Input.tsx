"use client";

import React from "react";
import cn from "@/utils/clsx";

type Variant = "primary" | "secondary";

interface InputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "children"> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent",
  secondary: "",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "primary", className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(variants[variant], className)}
        {...rest} 
      />
    );
  }
);

Input.displayName = "Input";
