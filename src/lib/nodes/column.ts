
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
