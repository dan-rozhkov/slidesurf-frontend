
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { SmartLayoutType } from "./smart-layout";
import { useMemo, memo } from "react";
import { LayoutFactory } from "@/components/layout-factory";
import { EditValueDialog } from "@/components/edit-value-dialog";
import { useLayoutDialog } from "@/lib/hooks/use-layout-dialog";

export const SmartLayoutItemView = memo(
  ({ node, getPos, editor, updateAttributes }: NodeViewProps) => {
    const layoutType = node.attrs.type as SmartLayoutType;
    const value = node.attrs.value as string;
    const position = getPos();

    const dialog = useLayoutDialog({
      onValueUpdate: (newValue) => updateAttributes({ value: newValue }),
    });

    // Get the index of the element among its siblings
    const { index, totalItems } = useMemo(() => {
      let index = 1;
      let totalItems = 1;

      if (position !== undefined) {
        const $pos = editor.state.doc.resolve(position);
        const parent = $pos.parent;
        totalItems = parent.childCount;

        if (parent && parent.childCount > 0) {
          for (let i = 0; i < parent.childCount; i++) {
            const child = parent.child(i);
            if (child && child.eq(node)) {
              index = i + 1;
              break;
            }
          }
        }
      }

      return { index, totalItems };
    }, [position, editor.state.doc, node]);

    // Get click handler based on layout type
    const onClick = useMemo(() => {
      switch (layoutType) {
        case "statistics":
          return dialog.getClickHandler("statistics", value || "50");
        case "big-numbers":
          return dialog.getClickHandler("big-numbers", value || "100");
        case "raiting-stars":
          return dialog.getClickHandler("raiting-stars", value || "3");
        default:
          return () => {};
      }
    }, [layoutType, value, dialog]);

    const getLayoutClassName = (layoutType: SmartLayoutType) => {
      switch (layoutType) {
        case "big-numbers":
          return "flex flex-col items-start justify-center w-full";
        case "statistics":
        case "raiting-stars":
          return "flex flex-col items-center justify-center w-full";
        case "quotes":
          return "flex flex-col items-center justify-center w-full relative pt-[1.4em] p-[1em] rounded-[0.5em] border-[0.1em] border-[var(--slide-accent)]";
        case "arrows-down":
          return "flex w-full gap-[1.6em] items-center";
        case "pyramid":
          return "flex w-full gap-[1.6em] items-center first:mt-0 last:mb-0 -mb-[1.2em]";
        case "funnel":
          return "flex w-full gap-[1.6em] items-center first:mt-0 last:mb-0 -mb-[1.2em]";
        default:
          return "flex flex-col flex-grow";
      }
    };

    return (
      <NodeViewWrapper
        data-type="smart-layout-item"
        data-smart-layout-type={layoutType}
        data-index={index}
        className={getLayoutClassName(layoutType)}
      >
        <LayoutFactory
          layoutType={layoutType}
          value={value}
          index={index}
          totalItems={totalItems}
          onClick={onClick}
        />

        <NodeViewContent />

        <EditValueDialog
          isOpen={dialog.isEditDialogOpen}
          onClose={dialog.closeDialog}
          onSubmit={dialog.handleSubmit}
          dialogType={dialog.dialogType}
          initialValue={dialog.initialValue}
        />
      </NodeViewWrapper>
    );
  }
);

SmartLayoutItemView.displayName = "SmartLayoutItemView";
