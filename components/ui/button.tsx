import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-primary/30 focus-visible:ring-[3px] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-sm hover:shadow-md",
        destructive:
          "bg-error text-white hover:bg-error/90 active:scale-95 shadow-sm hover:shadow-md focus-visible:ring-error/30 dark:focus-visible:ring-error/40",
        outline:
          "border border-primary/30 text-primary hover:bg-primary/5 dark:hover:bg-primary/20 active:bg-primary/10",
        secondary:
          "bg-secondary text-white hover:bg-secondary/90 active:scale-95 shadow-sm hover:shadow-md",
        ghost:
          "text-primary hover:bg-primary/10 dark:hover:bg-primary/20 active:bg-primary/15",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-info text-white hover:bg-info/90 active:scale-95 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
