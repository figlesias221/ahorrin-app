'use client';

import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils/cn';

interface SparklineProps {
  data: number[];
  height?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  trend?: 'up' | 'down' | 'stable';
}

export function Sparkline({
  data,
  height = 40,
  color = '#10b981',
  strokeWidth = 2,
  className,
  trend,
}: SparklineProps) {
  // Convert array of numbers to chart data format
  const chartData = data.map((value, index) => ({
    value,
    index,
  }));

  // Determine color based on trend if not explicitly set
  const lineColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : color;

  // Calculate min and max for better scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = (max - min) * 0.1;

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
        >
          <YAxis
            hide
            domain={[min - padding, max + padding]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={strokeWidth}
            dot={false}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}