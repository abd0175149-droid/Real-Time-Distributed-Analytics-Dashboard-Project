import React from 'react';
import { cn, formatCompact, formatPercentage, formatDuration, formatCurrency } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
  currency?: string;
  icon?: React.ReactNode;
  className?: string;
  invertChange?: boolean; // For metrics where decrease is good (like bounce rate)
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  previousValue,
  format = 'number',
  currency = 'USD',
  icon,
  className,
  invertChange = false,
}) => {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'percentage':
        return formatPercentage(val);
      case 'currency':
        return formatCurrency(val, currency);
      case 'duration':
        return formatDuration(val);
      default:
        return formatCompact(val);
    }
  };

  const getChange = () => {
    if (previousValue === undefined || previousValue === 0) return null;
    
    const change = ((value - previousValue) / previousValue) * 100;
    const isPositive = invertChange ? change < 0 : change > 0;
    const isNegative = invertChange ? change > 0 : change < 0;
    
    return {
      value: Math.abs(change),
      isPositive,
      isNegative,
      isNeutral: change === 0,
    };
  };

  const change = getChange();

  return (
    <div className={cn("kpi-card", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      
      <div className="flex items-end justify-between">
        <span className="kpi-value">{formatValue(value)}</span>
        
        {change && (
          <div
            className={cn(
              "kpi-change",
              change.isPositive && "positive",
              change.isNegative && "negative"
            )}
          >
            {change.isPositive && <TrendingUp className="w-4 h-4" />}
            {change.isNegative && <TrendingDown className="w-4 h-4" />}
            {change.isNeutral && <Minus className="w-4 h-4" />}
            <span>{change.value.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton version for loading state
export const KPICardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("kpi-card", className)}>
    <div className="flex items-center justify-between mb-2">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-5 w-5 rounded-full" />
    </div>
    <div className="flex items-end justify-between">
      <div className="skeleton h-9 w-32" />
      <div className="skeleton h-5 w-16" />
    </div>
  </div>
);
