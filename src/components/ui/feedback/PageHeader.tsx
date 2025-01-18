import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-[#105283]/10 rounded-lg">
          <Icon className="h-6 w-6 text-[#105283]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#105283]">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}