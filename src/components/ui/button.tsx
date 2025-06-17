
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-serif font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "mystic-button",
        destructive:
          "bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-200 border border-red-600/40 hover:from-red-500/30 hover:to-red-600/30 hover:border-red-500/60 shadow-lg",
        outline:
          "border-2 border-amber-600/40 bg-transparent text-amber-200 hover:bg-amber-600/10 hover:border-amber-500/60 hover:text-amber-100",
        secondary:
          "bg-gradient-to-r from-amber-800/20 to-orange-800/20 text-amber-300 border border-amber-700/40 hover:from-amber-700/30 hover:to-orange-700/30 hover:border-amber-600/60",
        ghost: "text-amber-200 hover:bg-amber-600/10 hover:text-amber-100",
        link: "text-amber-300 underline-offset-4 hover:underline hover:text-amber-200",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
