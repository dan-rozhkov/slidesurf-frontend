
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  LabelList,
} from "recharts";
import { useAtomValue } from "jotai";
import { presentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";
import { ChartType } from "@/types";
import { useMemo, useRef, useState } from "react";
import { useResizeObserver } from "@/lib/hooks/use-resize-observer";

type ChartData = {
  name: string;
  values: number[];
  headers?: string[];
};

type ChartPreviewProps = {
  data: ChartData[];
  chartType: ChartType;
  showLabels: boolean;
  showGrid: boolean;
  showValues: boolean;
  stacked?: boolean;
  colors?: string[];
};

export const ChartPreview: React.FC<ChartPreviewProps> = ({
  data,
  chartType,
  showLabels,
  showGrid,
  showValues,
  stacked = false,
  colors: customColors,
}) => {
  const presentation = useAtomValue(presentationAtom);
  const { theme } = useTheme(presentation?.themeId || null);

  const themeColors = theme?.colors?.chart || [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088fe",
  ];

  const COLORS = customColors?.length ? customColors : themeColors;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useResizeObserver(containerRef, () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  });

  const { shouldShowLabels, shouldShowLegend, shouldShowValues } =
    useMemo(() => {
      let labels = showLabels;
      let legend = showLabels;
      let values = showValues;

      if (containerWidth !== null && containerWidth < 300) {
        labels = false;
        legend = false;
        values = false;
      }

      return {
        shouldShowLabels: labels,
        shouldShowLegend: legend,
        shouldShowValues: values,
      };
    }, [showLabels, showValues, containerWidth]);

  const shouldReserveYAxisSpace =
    chartType === "h-bar" &&
    shouldShowLabels &&
    data.some((item) => typeof item?.name === "string" && item.name.length > 0);

  const yAxisReservedWidth = useMemo(() => {
    if (!shouldReserveYAxisSpace) {
      return 0;
    }

    const labels = data
      .map((item) => (typeof item?.name === "string" ? item.name : ""))
      .filter((label) => label.length > 0);

    if (!labels.length) {
      return 0;
    }

    const fallback = Math.max(...labels.map((label) => label.length)) * 7 + 16;

    if (typeof document === "undefined") {
      return fallback;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return fallback;
    }

    context.font = "1em sans-serif";
    const maxWidth = labels.reduce<number>((max, label) => {
      const width = context.measureText(label).width;
      return width > max ? width : max;
    }, 0);

    return Math.ceil(maxWidth + 16);
  }, [shouldReserveYAxisSpace, data]);

  const renderChart = () => {
    const seriesCount = data[0]?.values.length || 0;
    const seriesNames =
      data[0]?.headers?.slice(1) ||
      Array.from({ length: seriesCount }, (_, i) => `Series ${i + 1}`);

    switch (chartType) {
      case "bar":
        return (
          <BarChart
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: shouldShowValues ? 20 : 0,
              bottom: 0,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="name"
              padding={{ left: 0, right: 0 }}
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            <YAxis
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            {shouldShowLegend && (
              <Legend
                iconSize={16}
                iconType="square"
                margin={{ top: 10, right: 20 }}
                wrapperStyle={{ fontSize: "0.7em" }}
              />
            )}
            {seriesNames.map((name, index) => (
              <Bar
                key={name}
                dataKey={`values[${index}]`}
                name={name}
                fill={COLORS[index % COLORS.length]}
                isAnimationActive={false}
                stackId={stacked ? "stack" : undefined}
              >
                {shouldShowValues && (
                  <LabelList
                    dataKey={`values[${index}]`}
                    position={stacked ? "center" : "top"}
                    style={{
                      fontSize: "0.7em",
                      fill: stacked ? "#fff" : theme?.colors?.foreground,
                    }}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        );

      case "h-bar":
        return (
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: shouldReserveYAxisSpace ? 12 : 0,
              right: shouldShowValues ? 40 : 0,
              top: 0,
              bottom: 0,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}

            <XAxis
              type="number"
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={shouldReserveYAxisSpace ? yAxisReservedWidth : 0}
              tickMargin={8}
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />

            {shouldShowLegend && (
              <>
                <Legend
                  iconSize={16}
                  iconType="square"
                  margin={{ top: 10, right: 20 }}
                  wrapperStyle={{ fontSize: "0.7em" }}
                />
              </>
            )}
            {seriesNames.map((name, index) => (
              <Bar
                key={name}
                dataKey={`values[${index}]`}
                name={name}
                fill={COLORS[index % COLORS.length]}
                isAnimationActive={false}
                barSize="10%"
                stackId={stacked ? "stack" : undefined}
              >
                {shouldShowValues && (
                  <LabelList
                    dataKey={`values[${index}]`}
                    position={stacked ? "center" : "right"}
                    style={{
                      fontSize: "0.7em",
                      fill: stacked ? "#fff" : theme?.colors?.foreground,
                    }}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: shouldShowValues ? 20 : 0,
              bottom: 0,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}

            <XAxis
              dataKey="name"
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            <YAxis
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            {shouldShowLegend && (
              <Legend
                wrapperStyle={{ fontSize: "0.7em", padding: "0.5em" }}
                iconSize={16}
                iconType="square"
                margin={{ top: 10, right: 20 }}
              />
            )}

            {seriesNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={`values[${index}]`}
                name={name}
                stroke={COLORS[index % COLORS.length]}
                isAnimationActive={false}
                dot={shouldShowValues}
              >
                {shouldShowValues && (
                  <LabelList
                    dataKey={`values[${index}]`}
                    position="top"
                    style={{
                      fontSize: "0.7em",
                      fill: theme?.colors?.foreground,
                    }}
                  />
                )}
              </Line>
            ))}
          </LineChart>
        );

      case "pie":
        // For pie charts, we'll show the first series only
        const pieData = data.map((item) => ({
          name: item.name,
          value: item.values[0] || 0,
        }));
        return (
          <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              label={shouldShowValues}
              isAnimationActive={false}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                  style={{ fontSize: "0.8em" }}
                />
              ))}
            </Pie>
            {shouldShowLegend && (
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "0.7em", padding: "0.5em" }}
                iconSize={16}
                iconType="square"
              />
            )}
          </PieChart>
        );

      case "donut":
        const donutData = data.map((item) => ({
          name: item.name,
          value: item.values[0] || 0,
        }));
        return (
          <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Pie
              data={donutData}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              label={shouldShowValues}
              isAnimationActive={false}
            >
              {donutData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            {shouldShowLegend && (
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "0.7em", padding: "0.5em" }}
                iconSize={16}
                iconType="square"
              />
            )}
          </PieChart>
        );

      case "area":
        return (
          <AreaChart
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: shouldShowValues ? 20 : 0,
              bottom: 0,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="name"
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            <YAxis
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            {shouldShowLegend && (
              <Legend
                wrapperStyle={{ fontSize: "0.7em", padding: "0.5em" }}
                iconSize={16}
                iconType="square"
                margin={{ top: 10, right: 20 }}
              />
            )}
            {seriesNames.map((name, index) => (
              <Area
                key={name}
                type="monotone"
                dataKey={`values[${index}]`}
                name={name}
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
                isAnimationActive={false}
                stackId={stacked ? "stack" : undefined}
              >
                {showValues && (
                  <LabelList
                    dataKey={`values[${index}]`}
                    position="top"
                    style={{
                      fontSize: "0.7em",
                      fill: theme?.colors?.foreground,
                    }}
                  />
                )}
              </Area>
            ))}
          </AreaChart>
        );

      case "radar":
        const radarData = data.map((item) => ({
          name: item.name,
          ...Object.fromEntries(
            item.values.map((val, idx) => [`value${idx}`, val])
          ),
        }));

        return (
          <RadarChart
            data={radarData}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            {showGrid && <PolarGrid />}
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
            />
            <PolarRadiusAxis
              tick={{
                fill: theme?.colors?.foreground,
                fontSize: "0.7em",
              }}
            />
            {seriesNames.map((name, index) => (
              <Radar
                key={name}
                name={name}
                dataKey={`value${index}`}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.25}
                isAnimationActive={false}
              />
            ))}
            {shouldShowLegend && (
              <Legend
                wrapperStyle={{ fontSize: "0.7em", padding: "0.5em" }}
                iconSize={16}
                iconType="square"
                margin={{ top: 10, right: 20 }}
              />
            )}
          </RadarChart>
        );

      case "radial-bar":
        const radialData = data.map((item, itemIndex) => ({
          name: item.name,
          ...Object.fromEntries(
            item.values.map((val, idx) => [`value${idx}`, val])
          ),
          fill: COLORS[itemIndex % COLORS.length],
        }));

        return (
          <RadialBarChart
            data={radialData}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            style={{ aspectRatio: 1.618 }}
          >
            {seriesNames.map((name, index) => (
              <RadialBar
                key={name}
                background={{ fill: "var(--slide-smart-layout-stat-empty)" }}
                label={{
                  position: "insideStart",
                  fill: "var(--slide-foreground)",
                  fontSize: "0.6em",
                }}
                dataKey={`value${index}`}
                name={name}
                isAnimationActive={false}
              />
            ))}
            {shouldShowLegend && (
              <Legend
                wrapperStyle={{ fontSize: "0.7em", padding: "0.5em" }}
                iconSize={16}
                iconType="square"
                margin={{ top: 10, right: 20 }}
              />
            )}
          </RadialBarChart>
        );

      case "waterfall":
        // Transform data to waterfall format
        // First item is the base (100%), subsequent items show changes
        let cumulativeValue = 0;

        const waterfallData = data.map((item, index) => {
          const inputValue = item.values[0] || 0;

          if (index === 0) {
            // First item: full bar from 0 to baseValue
            cumulativeValue = inputValue;
            return {
              name: item.name,
              value: inputValue,
              label: inputValue,
              fill: COLORS[0] || "#4BC0C0",
            };
          } else {
            // Subsequent items: show change from previous cumulative value
            const previousValue = cumulativeValue;
            cumulativeValue += inputValue;

            return {
              name: item.name,
              value: [previousValue, cumulativeValue],
              label: inputValue,
              fill:
                inputValue >= 0
                  ? COLORS[1] || "#82ca9d"
                  : COLORS[2] || "#ff7300",
            };
          }
        });

        return (
          <BarChart
            data={waterfallData}
            margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            <XAxis
              dataKey="name"
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            <YAxis
              tick={{ fill: theme?.colors?.foreground, fontSize: "0.7em" }}
              hide={!shouldShowLabels}
            />
            <Bar dataKey="value" maxBarSize={15} isAnimationActive={false}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              {shouldShowLabels && <LabelList position="top" dataKey="label" />}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      ref={containerRef}
      contentEditable={false}
    >
      {containerWidth && (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
};
