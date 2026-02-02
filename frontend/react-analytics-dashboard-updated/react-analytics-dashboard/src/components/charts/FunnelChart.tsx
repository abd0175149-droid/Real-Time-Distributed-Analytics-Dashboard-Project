import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn, formatCompact, formatPercentage } from '../../lib/utils';
import { ArrowDown } from 'lucide-react';

interface FunnelStep {
  name: string;
  value: number;
  color?: string;
}

interface FunnelChartProps {
  title: string;
  data: FunnelStep[];
  showPercentage?: boolean;
  showDropoff?: boolean;
  className?: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  data,
  showPercentage = true,
  showDropoff = true,
  className,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  
  const getConversionRate = (index: number): number => {
    if (index === 0) return 100;
    return (data[index].value / data[0].value) * 100;
  };

  const getDropoffRate = (index: number): number => {
    if (index === 0) return 0;
    const prev = data[index - 1].value;
    const current = data[index].value;
    return prev > 0 ? ((prev - current) / prev) * 100 : 0;
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((step, index) => {
            const width = (step.value / maxValue) * 100;
            const conversionRate = getConversionRate(index);
            const dropoffRate = getDropoffRate(index);

            return (
              <div key={step.name}>
                {/* Dropoff indicator */}
                {showDropoff && index > 0 && dropoffRate > 0 && (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                    <ArrowDown className="w-4 h-4" />
                    <span>{formatPercentage(dropoffRate)} dropoff</span>
                  </div>
                )}

                {/* Funnel step */}
                <div className="relative">
                  <div
                    className={cn(
                      "h-12 rounded-lg flex items-center justify-between px-4 transition-all",
                      step.color || colors[index % colors.length]
                    )}
                    style={{
                      width: `${Math.max(width, 20)}%`,
                      margin: '0 auto',
                    }}
                  >
                    <span className="text-white font-medium truncate">{step.name}</span>
                    <span className="text-white font-mono font-semibold">
                      {formatCompact(step.value)}
                    </span>
                  </div>
                  
                  {showPercentage && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-20 text-sm text-muted-foreground">
                      {formatPercentage(conversionRate)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t flex justify-between text-sm">
          <span className="text-muted-foreground">Overall Conversion</span>
          <span className="font-semibold">
            {formatPercentage(getConversionRate(data.length - 1))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Skeleton
export const FunnelChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <div className="skeleton h-5 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[100, 80, 60, 40].map((width, i) => (
          <div
            key={i}
            className="skeleton h-12 rounded-lg mx-auto"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);
