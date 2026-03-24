import { Node, mergeAttributes } from "@tiptap/core";
import { ChartView } from "./chart-view";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ChartType } from "@/types";

export type ChartAttributes = {
  type: ChartType;
  data: {
    name: string;
    values: number[];
    headers?: string[];
  }[];
  showLabels: boolean;
  showGrid: boolean;
  showValues: boolean;
  stacked: boolean;
  colors?: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    chart: {
      setChart: (options: ChartAttributes) => ReturnType;
    };
  }
}

export const Chart = Node.create({
  name: "chart",
  group: "block",
  content: "block+",
  inline: false,
  draggable: true,
  atom: true,
  defining: true,
  isolating: true,
  selectable: true,

  addAttributes() {
    return {
      type: {
        default: "chart",
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => ({
          "data-type": attributes.type,
        }),
      },
      data: {
        default: [],
        parseHTML: (element) => {
          const data = element.getAttribute("data-data");
          if (!data) {
            return [];
          }

          try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
          } catch (error) {
            return [];
          }
        },
        renderHTML: (attributes) => ({
          "data-data": JSON.stringify(attributes.data),
        }),
      },
      showLabels: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute("data-show-labels") === "true",
        renderHTML: (attributes) => ({
          "data-show-labels": attributes.showLabels ? "true" : "false",
        }),
      },
      showGrid: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute("data-show-grid") === "true",
        renderHTML: (attributes) => ({
          "data-show-grid": attributes.showGrid ? "true" : "false",
        }),
      },
      showValues: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-show-values") === "true",
        renderHTML: (attributes) => ({
          "data-show-values": attributes.showValues ? "true" : "false",
        }),
      },
      stacked: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-stacked") === "true",
        renderHTML: (attributes) => ({
          "data-stacked": attributes.stacked ? "true" : "false",
        }),
      },
      chartType: {
        default: "bar",
        parseHTML: (element) => element.getAttribute("data-chart-type"),
        renderHTML: (attributes) => ({
          "data-chart-type": attributes.chartType,
        }),
      },
      colors: {
        default: [],
        parseHTML: (element) => {
          const colors = element.getAttribute("data-colors");
          if (!colors) {
            return [];
          }
          try {
            const parsed = JSON.parse(colors);
            return Array.isArray(parsed) ? parsed : [];
          } catch (error) {
            return [];
          }
        },
        renderHTML: (attributes) => ({
          "data-colors": JSON.stringify(attributes.colors || []),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='chart']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "chart",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartView, {
      as: "div",
    });
  },

  addCommands() {
    return {
      setChart:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
