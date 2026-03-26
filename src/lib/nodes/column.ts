
import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    column: {
      /**
       * Add a column
       */
      setColumn: () => ReturnType;
    };
  }
}

const Column = Node.create({
  name: "column",
  content: "block+",
  group: "block",
  inline: false,
  draggable: true,
  selectable: true,
  // defining: true,
  // isolating: true,

  addAttributes() {
    return {
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const w = element.getAttribute("data-width");
          return w ? parseFloat(w) : null;
        },
        renderHTML: (attributes: Record<string, unknown>) => {
          if (attributes.width === null || attributes.width === undefined) return {};
          return {
            "data-width": attributes.width,
            style: `flex: ${attributes.width} 0 0`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setColumn:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "column",
      }),
      0,
    ];
  },
});

export default Column;
