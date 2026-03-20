import { Table } from "@tiptap/extension-table";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TableView } from "./table-view";

export const ExtendedTable = Table.extend({
  draggable: true,
  selectable: true,

  addNodeView() {
    return ReactNodeViewRenderer(TableView, {
      contentDOMElementTag: "tbody",
    });
  },
});
