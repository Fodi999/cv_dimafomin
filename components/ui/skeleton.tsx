import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md overflow-hidden",
        "bg-gradient-to-r from-bg/50 via-bg-muted to-bg/50 dark:from-bg-dark/50 dark:via-bg-muted/50 dark:to-bg-dark/50",
        "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
