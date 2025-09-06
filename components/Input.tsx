"use client";

import React from "react";
import cn from "@/app/utils/clsx";

type Variant = "primary" | "secondary";

interface InputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "children"> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: "border border-gray-200 p-2 rounded-md",
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
