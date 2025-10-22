import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ValidationStatus } from '@/lib/parsers/preview-types';

interface ValidationBadgeProps {
  status: ValidationStatus;
  message?: string;
  compact?: boolean;
}

export function ValidationBadge({ status, message, compact = false }: ValidationBadgeProps) {
  if (status === 'valid') {
    return compact ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-500/20">
        <CheckCircle className="h-3 w-3 mr-1" />
        Válido
      </Badge>
    );
  }

  if (status === 'warning') {
    return compact ? (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    ) : (
      <Badge variant="default" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {message || 'Advertencia'}
      </Badge>
    );
  }

  return compact ? (
    <AlertCircle className="h-4 w-4 text-red-500" />
  ) : (
    <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-500/20">
      <AlertCircle className="h-3 w-3 mr-1" />
      {message || 'Error'}
    </Badge>
  );
}
