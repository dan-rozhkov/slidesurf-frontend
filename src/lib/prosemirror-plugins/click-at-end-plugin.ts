import { Plugin, PluginKey } from "prosemirror-state";
import { Node as PMNode } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";

export const ClickAtEndPlugin = new Plugin({
  key: new PluginKey("click-at-end"),
  props: {
    handleClick(view, _pos, event) {
      const coords = { left: event.clientX, top: event.clientY };
      const clicked = view.posAtCoords(coords);
      if (!clicked) return false;

      const { state } = view;
      const { doc } = state;

      if (clicked.pos >= doc.content.size) {
        const lastNode: PMNode | null = doc.lastChild;

        const needParagraph =
          !lastNode ||
          lastNode.type.name !== "paragraph" ||
          lastNode.content.size !== 0;

        if (needParagraph) {
          const pos = doc.content.size;
          const tr = state.tr.insert(
            pos,
            state.schema.nodes.paragraph.create()
          );
          view.dispatch(tr.scrollIntoView());

          requestAnimationFrame(() => {
            const newState = view.state;
            const newDoc = newState.doc;
            const newPos = newDoc.content.size - 1;
            const newTr = newState.tr.setSelection(
              TextSelection.create(newDoc, newPos)
            );
            view.dispatch(newTr);
          });

          return true;
        }
      }
      return false;
    },
  },
});
