import { useEditor } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { ExtendedTable } from "../nodes/extended-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Card } from "../nodes/card";
import Underline from "@tiptap/extension-underline";
import Columns from "../nodes/columns";
import Column from "../nodes/column";
import ExtendedTextStyle from "../nodes/extended-text-style";
import { ExtendedParagraph } from "../nodes/extended-paragraph";
import { ExtendedImage } from "../nodes/extended-image";
import { Chart } from "../nodes/chart";
import { FeaturesList } from "../nodes/features-list";
import { Feature } from "../nodes/feature";
import { Timeline } from "../nodes/timeline";
import { TimelineItem } from "../nodes/timeline-item";
import { SmartLayout } from "../nodes/smart-layout";
import { SmartLayoutItem } from "../nodes/smart-layout-item";
import { Flowchart } from "../nodes/flowchart";
import { BentoGrid } from "../nodes/bento-grid";
import { BentoGridItem } from "../nodes/bento-grid-item";
import { IconNode } from "../nodes/icon";
import { useIsPresentingAtom } from "./use-is-presenting";
import { useScopedI18n } from "@/lib/locales/client";
import { EditorInstance } from "@/types";
import { ClickAtEndPlugin } from "../prosemirror-plugins/click-at-end-plugin";
import { Extension } from "@tiptap/core";
import { Fragment, Slice } from "prosemirror-model";

const ClickAtEndExtension = Extension.create({
  name: "clickAtEnd",
  addProseMirrorPlugins() {
    return [ClickAtEndPlugin];
  },
});

export const useEditorInstance = ({
  slide,
  onUpdate,
  isEditable = true,
}: EditorInstance) => {
  const [isPresenting] = useIsPresentingAtom();
  const t = useScopedI18n("editor");

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          paragraph: false,
          dropcursor: {
            class: "text-primary",
            width: 2,
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph", "smallText", "monsterText"],
        }),
        ExtendedTextStyle,
        Underline,
        Columns,
        Column,
        Card,
        ExtendedTable,
        TableCell,
        TableHeader,
        TableRow,
        ExtendedImage,
        ExtendedParagraph,
        Chart,
        Feature,
        FeaturesList,
        Timeline,
        TimelineItem,
        SmartLayout,
        SmartLayoutItem,
        Flowchart,
        BentoGrid,
        BentoGridItem,
        IconNode,
        Placeholder.configure({
          placeholder: ({ node, editor }) => {
            if (editor?.isEmpty) {
              return t("startWriting");
            }

            if (node.type.name === "heading") {
              return t("writeHeading");
            }

            return t("writeText");
          },
          showOnlyWhenEditable: true,
          includeChildren: true,
        }),
        ClickAtEndExtension,
      ],
      content: slide.content,
      editable: isEditable,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onUpdate(editor.getHTML());
      },
      editorProps: {
        handleScrollToSelection: () => false,
        handlePaste(view, event) {
          const clipboard = event.clipboardData;
          if (!clipboard) return false;

          const types = Array.from(clipboard.types);
          if (types.includes("application/x-prosemirror-fragment")) {
            return false;
          }

          event.preventDefault();
          const text = clipboard.getData("text/plain");
          const { schema } = view.state;
          const paragraphs = text.split(/\r?\n/).map((line) => {
            return line.length > 0
              ? schema.nodes.paragraph.create(null, schema.text(line))
              : schema.nodes.paragraph.create();
          });
          view.dispatch(
            view.state.tr.replaceSelection(
              new Slice(Fragment.from(paragraphs), 1, 1)
            )
          );

          return true;
        },
      },
      onDrop: (event) => {
        if (isPresenting) {
          return;
        }

        const snippet = event.dataTransfer?.getData(
          "application/x-tiptap-node"
        );

        if (!snippet) {
          return;
        }

        const position = editor?.view.posAtCoords({
          top: event.clientY,
          left: event.clientX,
        });

        if (!position) {
          return;
        }

        editor?.commands.insertContentAt(
          position.pos,
          JSON.parse(snippet)?.content
        );
      },
    },
    [isPresenting || !isEditable ? slide.content : null]
  );

  return editor;
};
