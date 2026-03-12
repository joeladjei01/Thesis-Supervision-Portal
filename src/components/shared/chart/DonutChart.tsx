import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { LegendPayload } from "recharts";

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: ChartDataItem[];
  title?: string;
}

type LegendPayloadItem = LegendPayload;

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title = "SIMPLE DONUT CHART",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number): void => {
    setActiveIndex(index);
  };

  const onPieLeave = (): void => {
    setActiveIndex(null);
  };

  const renderCustomLabel = (props: any): React.ReactElement | null => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined ||
      innerRadius === undefined ||
      outerRadius === undefined ||
      percent === undefined
    ) {
      return null;
    }
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-base font-bold shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLegend = (props: any): React.ReactElement | null => {
    const payload = (props?.payload ?? []) as LegendPayloadItem[];

    if (payload.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 justify-start mt-6 flex-wrap w-full max-w-md">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 group cursor-default"
          >
            <div
              className="w-3.5 h-3.5 rounded-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full p-8 bg-gray-50 dark:bg-card border dark:border-border rounded-2xl flex flex-col items-center shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-10 text-center">
        {title}
      </h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={160}
              innerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="none"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-300"
                  style={{
                    filter:
                      activeIndex === index ? "brightness(1.1)" : "brightness(1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>
            <Legend content={renderLegend} verticalAlign="bottom" align="center" />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "12px",
                padding: "10px 14px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#1f2937", fontWeight: 600, fontSize: "13px" }}
              cursor={{ fill: "transparent" }}
              formatter={(value, name) => [`${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Example usage component
const DonutChartExample: React.FC = () => {
  const chartData: ChartDataItem[] = [
    { name: "Apples", value: 30, color: "#E67E73" },
    { name: "Lemons", value: 50, color: "#F5C344" },
    { name: "Plums", value: 20, color: "#8B7FC7" },
  ];

  return (
    <div className="w-full min-h-screen bg-white dark:bg-background p-10">
      <DonutChart data={chartData} title="SIMPLE DONUT CHART" />
    </div>
  );
};

export default DonutChartExample;
export { DonutChart };
