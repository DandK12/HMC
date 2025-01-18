import { LucideIcon } from 'lucide-react';
import { Button } from '../Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#105283]/10 mb-4">
        <Icon className="h-8 w-8 text-[#105283]" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="inline-flex items-center">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}