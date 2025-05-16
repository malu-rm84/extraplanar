// SelectDropdown.tsx
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectDropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const SelectDropdown = forwardRef<HTMLSelectElement, SelectDropdownProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full bg-black/50 text-gray-200 border border-white/10 rounded-lg p-2.5",
          "focus:ring-primary focus:border-primary/40 focus:outline-none focus:ring-2",
          "hover:border-primary/30 transition-colors",
          "appearance-auto", // Mantém a seta do dropdown
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