import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text" | "button"
  width?: number | string
  height?: number | string
}

function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  ...props
}: SkeletonProps) {
  const style = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        {
          "rounded-full": variant === "circular",
          "h-4 w-full": variant === "text" && !width && !height,
          "h-10 w-20 rounded-md": variant === "button" && !width && !height,
        },
        className
      )}
      style={style}
      {...props}
    />
  )
}

export { Skeleton }
