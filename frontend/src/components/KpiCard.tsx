import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/ui';

interface KpiCardProps {
  title: string;
  value: string | number;
  sublabel: string;
  icon: string;
  trend: {
    direction: 'up' | 'down' | 'flat';
    value: number;
    percentage: boolean;
  };
}

const getIconComponent = (iconName: string) => {
  // Map icon names to Lucide components
  const iconMap: Record<string, React.ComponentType<any>> = {
    BookOpen: () => <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-blue-600 text-lg">📚</span></div>,
    CheckCircle: () => <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center"><span className="text-green-600 text-lg">✓</span></div>,
    TrendingUp: () => <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center"><span className="text-emerald-600 text-lg">📈</span></div>,
    AlertTriangle: () => <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center"><span className="text-amber-600 text-lg">⚠</span></div>,
    FileText: () => <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center"><span className="text-indigo-600 text-lg">📄</span></div>,
  };
  
  return iconMap[iconName] || iconMap.BookOpen;
};

const getTrendIcon = (direction: 'up' | 'down' | 'flat') => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    case 'flat':
      return <Minus className="w-4 h-4 text-gray-500" />;
  }
};

const getTrendColor = (direction: 'up' | 'down' | 'flat') => {
  switch (direction) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'flat':
      return 'text-gray-500';
  }
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  sublabel,
  icon,
  trend,
}) => {
  const IconComponent = getIconComponent(icon);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <IconComponent />
        <div className={cn("flex items-center gap-1", getTrendColor(trend.direction))}>
          {getTrendIcon(trend.direction)}
          <span className="text-sm font-medium">
            {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
            {trend.value}
            {trend.percentage ? '%' : ''}
          </span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{sublabel}</p>
      </div>
    </div>
  );
};


