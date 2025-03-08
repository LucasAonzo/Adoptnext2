'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type AdoptionStatus = 'pendiente' | 'aprobada' | 'rechazada';

interface AdoptionStatusBadgeProps {
  status: AdoptionStatus;
  className?: string;
}

const statusConfig: Record<
  AdoptionStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pendiente: {
    label: 'Pending',
    variant: 'secondary',
  },
  aprobada: {
    label: 'Approved',
    variant: 'default',
  },
  rechazada: {
    label: 'Rejected',
    variant: 'destructive',
  },
};

export function AdoptionStatusBadge({ status, className }: AdoptionStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
} 