import { Node, mergeAttributes } from "@tiptap/core";
import { FlowchartView } from "./flowchart-view";
import { ReactNodeViewRenderer } from "@tiptap/react";

export type FlowchartNode = {
  content: string; // HTML content
  children?: FlowchartNode[];
};

export type FlowchartAttributes = {
  data: FlowchartNode[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    flowchart: {
      setFlowchart: (options: FlowchartAttributes) => ReturnType;
      updateFlowchart: (options: Partial<FlowchartAttributes>) => ReturnType;
    };
  }
}

export const Flowchart = Node.create({
  name: "flowchart",
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
      data: {
        default: [
          {
            content: "<p>Parent</p>",
            children: [
              {
                content: "<p>Child</p>",
                children: [{ content: "<p>Grand Child</p>" }],
              },
              {
                content: "<p>Child</p>",
                children: [
                  { content: "<p>Grand Child</p>" },
                  {
                    content: "<p>Grand Child</p>",
                    children: [
                      { content: "<p>Great Grand Child</p>" },
                      { content: "<p>Great Grand Child</p>" },
                      { content: "<p>Great Grand Child</p>" },
                    ],
                  },
                  { content: "<p>Grand Child</p>" },
                ],
              },
            ],
          },
        ],
        parseHTML: (element) => {
          const data = element.getAttribute("data-data");
          return data ? JSON.parse(data) : [];
        },
        renderHTML: (attributes) => ({
          "data-data": JSON.stringify(attributes.data),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='flowchart']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "flowchart",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlowchartView, {
      as: "div",
    });
  },

  addCommands() {
    return {
      setFlowchart:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateFlowchart:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },
});

