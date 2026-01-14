"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded border-2 border-gray-400 dark:border-gray-600",
        "bg-white dark:bg-gray-800",
        "transition-all duration-200",
        "hover:border-orange-400 dark:hover:border-orange-500",
        "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
        "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500",
        "data-[state=checked]:text-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "outline-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
