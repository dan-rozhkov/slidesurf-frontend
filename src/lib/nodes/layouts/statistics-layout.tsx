
import { PieChart, Pie, Cell } from "recharts";
import { memo } from "react";
import { EditableLayoutProps } from "@/types";

type StatisticsLayoutProps = EditableLayoutProps;

export const StatisticsLayout = memo(
  ({ value, onClick }: StatisticsLayoutProps) => {
    // Data for donut chart (50% filled)
    const chartData = [
      {
        name: "filled",
        value: value ? Number(value) : 50,
        fill: "var(--slide-smart-layout-stat-fill)",
      },
      {
        name: "empty",
        value: value ? 100 - Number(value) : 50,
        fill: "var(--slide-smart-layout-stat-empty)",
      },
    ];

    return (
      <div
        contentEditable={false}
        className="flex items-center justify-center w-[8em] h-[8em] mb-[0.5em] cursor-pointer hover:opacity-80 transition-opacity relative"
        onClick={onClick}
      >
        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center ml-[0.2em] mt-[0.2em] text-[1em] text-[var(--slide-foreground)] font-[family-name:var(--slide-font-family)]">
          {value ? value : "50"}%
        </span>
        <PieChart width={120} height={120}>
          <Pie
            data={chartData}
            cx={60}
            cy={60}
            innerRadius={36}
            outerRadius={50}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke="transparent"
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    );
  }
);

StatisticsLayout.displayName = "StatisticsLayout";
