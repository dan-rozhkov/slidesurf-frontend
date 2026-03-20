
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

export interface SimpleTiptapEditorRef {
  focus: () => void;
  getHTML: () => string;
  getText: () => string;
}

interface SimpleTiptapEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const SimpleTiptapEditor = forwardRef<
  SimpleTiptapEditorRef,
  SimpleTiptapEditorProps
>(
  (
    { defaultValue, onChange, placeholder, autoFocus, className, onKeyDown },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          horizontalRule: false, // Keep "---" as text, don't convert to <hr>
          blockquote: false,
          code: false,
          codeBlock: false,
          strike: false,
        }),
        Placeholder.configure({
          placeholder: placeholder || "",
        }),
      ],
      content: defaultValue || "",
      autofocus: autoFocus ? "end" : false,
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm max-w-none focus:outline-none min-h-[80px]",
            // Paragraph styles - make them look like regular text input
            "[&_p]:my-0 [&_p]:leading-relaxed [&_p]:text-[16px]",
            "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child::before]:text-muted-foreground [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:h-0",
            // Heading styles - subtle differences
            "[&_h1]:text-xl [&_h1]:font-semibold [&_h1]:my-1 [&_h1]:leading-tight [&_h1]:text-[16px]",
            "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:my-1 [&_h2]:leading-tight [&_h2]:text-[16px]",
            "[&_h3]:text-base [&_h3]:font-medium [&_h3]:my-1 [&_h3]:leading-tight [&_h3]:text-[16px]",
            // List styles
            "[&_ul]:my-1 [&_ul]:pl-5 [&_ul]:list-disc",
            "[&_ol]:my-1 [&_ol]:pl-5 [&_ol]:list-decimal",
            "[&_li]:my-0.5 [&_li]:text-[16px]"
          ),
        },
        handleKeyDown: (view, event) => {
          // Convert ProseMirror event to React KeyboardEvent-like object
          const reactEvent = {
            key: event.key,
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          } as React.KeyboardEvent;

          if (onKeyDown) {
            onKeyDown(reactEvent);
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
    });

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus();
      },
      getHTML: () => {
        return editor?.getHTML() || "";
      },
      getText: () => {
        return editor?.getText() || "";
      },
    }));

    if (!editor) {
      return null;
    }

    return (
      <div
        className={cn(
          "w-full rounded-lg border border-input bg-background text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
          className
        )}
      >
        <EditorContent editor={editor} />
      </div>
    );
  }
);

SimpleTiptapEditor.displayName = "SimpleTiptapEditor";
