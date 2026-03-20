
import { Node, mergeAttributes, NodeConfig, CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ColumnsView } from "./columns-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      addColumn: () => ReturnType;
    };
  }
}

const Columns = Node.create<NodeConfig>({
  name: "columns",
  content: "column{1,4}",
  group: "block",
  // defining: true,
  // isolating: true,
  draggable: true,
  inline: false,
  selectable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "columns" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnsView);
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "column",
                content: [{ type: "paragraph" }],
              },
              {
                type: "column",
                content: [{ type: "paragraph" }],
              },
            ],
          });
        },
    };
  },
});

export default Columns;
