import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { chartColorArray, formatCompact, formatPercentage } from '../../lib/utils';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title: string;
  data: DataPoint[];
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  height = 250,
  showLegend = true,
  showLabels = false,
  innerRadius = 0,
  className,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${formatPercentage(percent * 100)}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={showLabels ? renderCustomLabel : undefined}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || chartColorArray[index % chartColorArray.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                `${formatCompact(value)} (${formatPercentage((value / total) * 100)})`,
                undefined,
              ]}
            />
            {showLegend && (
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Donut variant
export const DonutChart: React.FC<PieChartProps> = (props) => (
  <PieChart {...props} innerRadius={50} />
);

// Skeleton
export const PieChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <div className="skeleton h-5 w-32" />
    </CardHeader>
    <CardContent className="flex items-center justify-center">
      <div className="skeleton w-40 h-40 rounded-full" />
    </CardContent>
  </Card>
);
