import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectDropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  variant?: "default" | "inline"; // Adicione esta linha
}

const SelectDropdown = forwardRef<HTMLSelectElement, SelectDropdownProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full bg-black/50 text-gray-200 border border-white/10 rounded-lg",
          "focus:ring-primary focus:border-primary/40 focus:outline-none focus:ring-2",
          "hover:border-primary/30 transition-colors text-sm",
          "appearance-auto",
          variant === "inline" ? "px-3 py-1 rounded-full" : "px-4 py-2.5",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

SelectDropdown.displayName = "SelectDropdown";

export { SelectDropdown };