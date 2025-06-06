import { CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/utils'

type StatusType = 'PENDING' | 'FINISHED' | 'CANCELLED'

type BadgeConfig = {
  label: string
  color: string
  icon?: React.ReactNode
}

type BadgeStatusProps = {
  status: StatusType
}

const badge: Record<StatusType, BadgeConfig> = {
  FINISHED: {
    label: 'Finalizado',
    color:
      'bg-emerald-50 dark:bg-emerald-300/10 text-emerald-500 border-emerald-500 dark:text-emerald-400',
    icon: <CheckCircleIcon size={16} />,
  },
  PENDING: {
    label: 'Pendente',
    color:
      'bg-yellow-50 dark:bg-yellow-300/10 text-yellow-500 border-yellow-500 dark:text-yellow-400',
    icon: <ClockIcon size={16} />,
  },
  CANCELLED: {
    label: 'Cancelado',
    color:
      'bg-rose-50 dark:bg-rose-300/10 text-rose-500 border-rose-500 dark:text-rose-400',
    icon: <XCircleIcon size={16} />,
  },
}

export function BadgeStatus({ status }: BadgeStatusProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex min-w-[7rem] items-center justify-center gap-4 border p-1.5 capitalize',
        badge[status].color,
      )}
    >
      {badge[status].icon}
      <span>{badge[status].label}</span>
    </Badge>
  )
}
