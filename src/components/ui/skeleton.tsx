import { cn } from '@/utils/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/20', className)}
      {...props}
    />
  )
}

export { Skeleton }
