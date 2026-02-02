import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { chartColorArray, formatCompact, formatDate } from '../../lib/utils';

interface DataPoint {
  [key: string]: string | number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  lines: {
    dataKey: string;
    name: string;
    color?: string;
  }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  formatXAxis?: (value: string) => string;
  formatYAxis?: (value: number) => string;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  lines,
  xAxisKey = 'timestamp',
  height = 300,
  showGrid = true,
  showLegend = true,
  formatXAxis,
  formatYAxis,
  className,
}) => {
  const defaultFormatX = (value: string) => {
    try {
      return formatDate(value, 'MMM d');
    } catch {
      return value;
    }
  };

  const defaultFormatY = (value: number) => formatCompact(value);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border" />}
            <XAxis
              dataKey={xAxisKey}
              tickFormatter={formatXAxis || defaultFormatX}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              axisLine={{ className: 'stroke-border' }}
              tickLine={{ className: 'stroke-border' }}
            />
            <YAxis
              tickFormatter={formatYAxis || defaultFormatY}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              axisLine={{ className: 'stroke-border' }}
              tickLine={{ className: 'stroke-border' }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelFormatter={(value) => (formatXAxis || defaultFormatX)(String(value))}
              formatter={(value: number) => [
                (formatYAxis || defaultFormatY)(value),
                undefined,
              ]}
            />
            {showLegend && <Legend />}
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color || chartColorArray[index % chartColorArray.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Skeleton
export const LineChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <div className="skeleton h-5 w-32" />
    </CardHeader>
    <CardContent>
      <div className="skeleton w-full h-[300px]" />
    </CardContent>
  </Card>
);
