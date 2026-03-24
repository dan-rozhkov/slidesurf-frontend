
import { useState, useCallback } from "react";
import { apiFetch } from "@/api/client";
import Spreadsheet from "react-spreadsheet";
import { Matrix } from "@iddan/react-spreadsheet";
import { ChartToolbar } from "./chart-toolbar";
import { ChartType } from "@/types";
import { ChartPreview } from "./chart-preview";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Minus } from "lucide-react";
import { transformDataForChart } from "@/lib/utils";
import { WithTooltip } from "@/components/ui/with-tooltip";
import { useAtomValue } from "jotai";
import { presentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";

const defaultData: Matrix = [
  [{ value: "Фрукты" }, { value: "Количество" }],
  [{ value: "Яблоки" }, { value: "45" }],
  [{ value: "Бананы" }, { value: "60" }],
  [{ value: "Апельсины" }, { value: "40" }],
];

type ChartEditorState = {
  data: Matrix;
  chartType: ChartType;
  showLabels: boolean;
  showGrid: boolean;
  showValues: boolean;
  stacked: boolean;
  colors: string[];
};

export const ChartEditor = ({
  initialState,
  onUpdate,
}: {
  initialState: ChartEditorState;
  onUpdate: (state: ChartEditorState) => void;
}) => {
  const [data, setData] = useState<Matrix>(initialState.data || defaultData);
  const [chartType, setChartType] = useState<ChartType>(
    initialState.chartType || "bar"
  );
  const [showLabels, setShowLabels] = useState<boolean>(
    initialState.showLabels || true
  );
  const [showGrid, setShowGrid] = useState<boolean>(
    initialState.showGrid || true
  );
  const [showValues, setShowValues] = useState<boolean>(
    initialState.showValues || false
  );
  const [stacked, setStacked] = useState<boolean>(
    initialState.stacked || false
  );
  const [colors, setColors] = useState<string[]>(initialState.colors || []);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presentation = useAtomValue(presentationAtom);
  const { theme } = useTheme(presentation?.themeId || null);
  const themeColors = theme?.colors?.chart || [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088fe",
  ];

  const seriesCount = data[0] ? Math.max(data[0].length - 1, 0) : 0;

  const addRow = useCallback(() => {
    setData((prevData) => {
      const newRow = Array(prevData[0].length).fill({ value: "" });
      return [...prevData, newRow];
    });
  }, []);

  const addColumn = useCallback(() => {
    setData((prevData) => {
      return prevData.map((row) => [...row, { value: "" }]);
    });
  }, []);

  const deleteRow = useCallback(() => {
    setData((prevData) => {
      if (prevData.length <= 1) return prevData;
      return prevData.slice(0, -1);
    });
  }, []);

  const deleteColumn = useCallback(() => {
    setData((prevData) => {
      if (prevData[0].length <= 1) return prevData;
      return prevData.map((row) => row.slice(0, -1));
    });
  }, []);

  const handleGenerateChart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch("/api/generate/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      const headers = data.headers.map((header: string) => ({ value: header }));

      const values = data.data.map(
        (item: { name: string; values: number[] }) => {
          return [
            { value: item.name },
            ...item.values.map((value: number) => ({ value })),
          ];
        }
      );

      setData([headers, ...values]);
      setChartType(data.chartType);
      setShowLabels(data.showLabels);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-[2fr_1fr] gap-12">
        <div className="w-full flex-1 flex flex-col gap-4">
          <div className="relative pt-4">
            <Textarea
              placeholder="Вставьте данные или опишите, что вы хотите построить"
              className="w-full"
              value={prompt}
              rows={4}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <WithTooltip
              display="Сгенерировать график по описанию или данным"
              trigger={
                <Button
                  onClick={handleGenerateChart}
                  className="absolute right-2 bottom-2"
                  disabled={isLoading}
                >
                  {isLoading && <Loader className="size-4 animate-spin" />}
                  Сгенерировать
                </Button>
              }
            />
          </div>

          <h3 className="text-lg font-semibold">Данные</h3>
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <Spreadsheet data={data} onChange={setData} />
              <div className="flex gap-2">
                <WithTooltip
                  display="Удалить строку"
                  trigger={
                    <Button variant="outline" size="sm" onClick={deleteRow}>
                      <Minus strokeWidth={1.5} className="size-4" />
                    </Button>
                  }
                />
                <WithTooltip
                  display="Добавить строку"
                  side="bottom"
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRow}
                      className="flex-1"
                    >
                      <Plus strokeWidth={1.5} className="size-4" />
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 h-full">
              <WithTooltip
                display="Удалить столбец"
                trigger={
                  <Button variant="outline" size="sm" onClick={deleteColumn}>
                    <Minus strokeWidth={1.5} className="size-4" />
                  </Button>
                }
              />
              <WithTooltip
                display="Добавить столбец"
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addColumn}
                    className="flex-1"
                  >
                    <Plus strokeWidth={1.5} className="size-4" />
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Предпросмотр</h3>
          <div className="w-full h-[20em]">
            <ChartPreview
              data={transformDataForChart(data)}
              chartType={chartType}
              showLabels={showLabels}
              showGrid={showGrid}
              showValues={showValues}
              stacked={stacked}
              colors={colors}
            />
          </div>

          <ChartToolbar
            chartType={chartType}
            onChartTypeChange={setChartType}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels((state) => !state)}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid((state) => !state)}
            showValues={showValues}
            onToggleValues={() => setShowValues((state) => !state)}
            stacked={stacked}
            onToggleStacked={() => setStacked((state) => !state)}
            colors={colors}
            onColorsChange={setColors}
            seriesCount={seriesCount}
            themeColors={themeColors}
          />

          <Button
            onClick={() => {
              onUpdate({ data, chartType, showLabels, showGrid, showValues, stacked, colors });
            }}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
