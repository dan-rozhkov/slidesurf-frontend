
import { useEditor, EditorContent } from "@tiptap/react";
import { ExtendedParagraph } from "./extended-paragraph";
import StarterKit from "@tiptap/starter-kit";
import ExtendedTextStyle from "./extended-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef, memo } from "react";
import { useDebouncedCallback } from "use-debounce";

interface FlowchartNodeEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  isEditable: boolean;
}

const FlowchartNodeEditorComponent = ({
  content,
  onUpdate,
  isEditable,
}: FlowchartNodeEditorProps) => {
  const isUpdatingRef = useRef(false);
  const lastExternalContentRef = useRef(content);
  const lastSentContentRef = useRef<string | null>(null);

  // Use ref to always have access to the latest callback
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const debouncedOnUpdate = useDebouncedCallback((html: string) => {
    if (!isUpdatingRef.current) {
      lastSentContentRef.current = html;
      onUpdateRef.current(html);
    }
  }, 300);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          paragraph: false,
        }),
        ExtendedTextStyle,
        Underline,
        TextAlign.configure({
          types: ["paragraph"],
        }),
        ExtendedParagraph,
      ],
      content,
      editable: isEditable,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        if (!isUpdatingRef.current) {
          debouncedOnUpdate(editor.getHTML());
        }
      },
      editorProps: {
        handleScrollToSelection: () => false,
      },
    },
    [isEditable]
  );

  // Handle external content updates
  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const isFocused = editor.view.hasFocus();

    // Only update if content changed externally
    if (content === lastExternalContentRef.current) return;

    lastExternalContentRef.current = content;

    // Don't update if this content matches what we just sent (user typing)
    if (content === lastSentContentRef.current) {
      lastSentContentRef.current = null;
      return;
    }

    // Don't update if editor is focused or content already matches
    if (isFocused || content === currentHtml) return;

    // Capture content for the microtask
    const contentToSet = content;

    // Apply external content update in a microtask to avoid flushSync during render
    queueMicrotask(() => {
      // Check if the content is still the one we want to set
      if (
        !editor.isDestroyed &&
        lastExternalContentRef.current === contentToSet
      ) {
        isUpdatingRef.current = true;
        editor.commands.setContent(contentToSet || "<p></p>", false);
        isUpdatingRef.current = false;
      }
    });
  }, [content, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedOnUpdate.cancel();
    };
  }, [debouncedOnUpdate]);

  return (
    <EditorContent
      editor={editor}
      className="flowchart-node-editor"
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export const FlowchartNodeEditor = memo(FlowchartNodeEditorComponent);
