import cn from "@/utils/clsx";
import { forwardRef } from "react";

type Variant = "primary" | "secondary"

interface InputProps extends React.ComponentPropsWithoutRef<"button">{
    variant? : Variant
}

const variants = {
    primary:
      "bg-black p-2 rounded-md text-white hover:bg-gray-800 active:scale-95 transition-all duration-150",
    secondary:
      "bg-white border border-gray-300 p-2 rounded-md text-black hover:bg-gray-100 active:scale-95 transition-all duration-150",
};

export const Button = forwardRef<HTMLButtonElement, InputProps>(({variant = "primary", type = "button", children, className, ...rest} , ref) => {
    return(
        <button 
            ref={ref}
            className={cn(variants[variant], className)} 
            type={type}
            {...rest}
        >
            {children}
        </button>
    )
})  