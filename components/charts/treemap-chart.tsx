'use client';

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

interface TreemapData {
  name: string;
  size: number;
  color: string;
  children?: TreemapData[];
}

interface TreemapChartProps {
  data: TreemapData[];
  height?: number;
  tooltipFormatter?: (value: number) => string;
  showLabels?: boolean;
}

const COLORS = ['#10b981', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#14b8a6', '#64748b'];

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, name, value, color } = props;

  // Only show labels for boxes that are large enough
  const showLabel = width > 60 && height > 30;
  const fontSize = Math.min(width / 10, height / 4, 14);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color || COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {showLabel && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - fontSize / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize}
            fontWeight="600"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + fontSize}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize * 0.8}
            opacity={0.9}
          >
            {value ? `${((value / root.value) * 100).toFixed(1)}%` : ''}
          </text>
        </>
      )}
    </g>
  );
};

export function TreemapChart({
  data,
  height = 400,
  tooltipFormatter = (value) => value.toLocaleString(),
  showLabels = true,
}: TreemapChartProps) {
  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || COLORS[index % COLORS.length],
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {tooltipFormatter(data.value)}
          </p>
          {data.root && (
            <p className="text-xs text-muted-foreground mt-1">
              {((data.value / data.root.value) * 100).toFixed(1)}% del total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={processedData}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        fill="#8884d8"
        content={showLabels ? <CustomizedContent /> : undefined}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}