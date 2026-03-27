import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";

export function useNodeHasFocus(
  editor: Editor,
  getPos: () => number,
  nodeSize: number
): boolean {
  const [hasFocus, setHasFocus] = useState(false);
  const getPosRef = useRef(getPos);
  const nodeSizeRef = useRef(nodeSize);

  getPosRef.current = getPos;
  nodeSizeRef.current = nodeSize;

  useEffect(() => {
    const update = () => {
      if (!editor.isFocused) {
        setHasFocus(false);
        return;
      }
      try {
        const pos = getPosRef.current();
        const end = pos + nodeSizeRef.current;
        const { from, to } = editor.state.selection;
        setHasFocus(from >= pos && to <= end);
      } catch {
        setHasFocus(false);
      }
    };

    editor.on("selectionUpdate", update);
    editor.on("focus", update);
    editor.on("blur", update);
    update();

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("focus", update);
      editor.off("blur", update);
    };
  }, [editor]);

  return hasFocus;
}
