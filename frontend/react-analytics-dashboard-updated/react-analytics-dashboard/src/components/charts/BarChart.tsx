import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { chartColorArray, formatCompact } from '../../lib/utils';

interface DataPoint {
  [key: string]: string | number;
}

interface BarChartProps {
  title: string;
  data: DataPoint[];
  bars: {
    dataKey: string;
    name: string;
    color?: string;
    stackId?: string;
  }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: 'vertical' | 'horizontal';
  formatXAxis?: (value: string) => string;
  formatYAxis?: (value: number) => string;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  bars,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = false,
  layout = 'horizontal',
  formatXAxis,
  formatYAxis,
  className,
}) => {
  const isVertical = layout === 'vertical';

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border" />}
            {isVertical ? (
              <>
                <XAxis
                  type="number"
                  tickFormatter={formatYAxis || formatCompact}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  dataKey={xAxisKey}
                  type="category"
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  width={100}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xAxisKey}
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tickFormatter={formatYAxis || formatCompact}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  width={50}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatCompact(value), undefined]}
            />
            {showLegend && <Legend />}
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color || chartColorArray[index % chartColorArray.length]}
                stackId={bar.stackId}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Skeleton
export const BarChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <div className="skeleton h-5 w-32" />
    </CardHeader>
    <CardContent>
      <div className="skeleton w-full h-[300px]" />
    </CardContent>
  </Card>
);
