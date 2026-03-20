
import { useEffect, useState } from "react";
import { apiFetch } from "@/api/client";
import { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Trash2,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeSelection } from "prosemirror-state";
import ContentAIPopover from "@/components/editor/content-ai-popover";
import { useScopedI18n } from "@/lib/locales/client";
import { useCurrentSlideIdAtom } from "@/lib/hooks/use-current-slide-id";
import { TextColorPicker } from "@/components/text-color-picker";

const FloatingMenu = ({
  editor,
  slideId,
}: {
  editor: Editor;
  slideId?: string;
}) => {
  const t = useScopedI18n("editor");
  const [position, setPosition] = useState({ top: 0, left: 0, visible: false });
  const [currentSlideId] = useCurrentSlideIdAtom();

  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, " ");
  };

  const handleCustomPrompt = async (prompt: string, selectedText: string) => {
    try {
      const response = await apiFetch("/api/generate/selected-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedText,
          userPrompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process text");
      }

      const modifiedText = await response.text();

      // Replace selected text with AI-generated text
      const { from, to } = editor.state.selection;
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(modifiedText)
        .run();
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    const selectedText = getSelectedText();
    if (!selectedText) return;

    try {
      const response = await apiFetch("/api/generate/selected-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedText,
          actionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process text");
      }

      const modifiedText = await response.text();

      // Replace selected text with AI-generated text
      const { from, to } = editor.state.selection;
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(modifiedText)
        .run();
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      const { from, to } = editor.state.selection;
      const isBlock =
        editor.state.selection instanceof NodeSelection
          ? editor.state.selection.node.type.isBlock
          : false;

      if (from === to || isBlock) {
        setPosition((prev) => ({ ...prev, visible: false }));
        return;
      }

      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

      setPosition({
        top: end.bottom + window.scrollY,
        left: (start.left + end.left) / 2,
        visible: true,
      });
    };

    editor.on("selectionUpdate", updatePosition);
    editor.on("update", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("update", updatePosition);
    };
  }, [editor]);

  useEffect(() => {
    if (slideId && currentSlideId && slideId !== currentSlideId) {
      setPosition((prev) => ({ ...prev, visible: false }));
    }
  }, [currentSlideId, slideId]);

  const updateHeading = (value: string) => {
    const textSyles = ["smallText", "monsterText", "titular"];

    if (!textSyles.includes(value)) {
      editor
        .chain()
        .focus()
        .setMark("textStyle", {
          fontSize: null,
          fontWeight: null,
          lineHeight: null,
        })
        .run();
    }

    switch (value) {
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
      case "smallText":
        if (editor.isActive("heading")) {
          editor.chain().focus().setParagraph().run();
        }
        editor
          .chain()
          .focus()
          .setMark("textStyle", { fontSize: "0.75em" })
          .run();
        break;
      case "monsterText":
        if (editor.isActive("heading")) {
          editor.chain().focus().setParagraph().run();
        }
        editor
          .chain()
          .focus()
          .setMark("textStyle", { fontSize: "3em", fontWeight: "bold" })
          .run();
        break;
      case "titular":
        if (editor.isActive("heading")) {
          editor.chain().focus().setParagraph().run();
        }
        editor
          .chain()
          .focus()
          .setMark("textStyle", {
            fontSize: "2.5em",
            fontWeight: "bold",
            lineHeight: "1.2em",
          })
          .run();
        break;
      default:
        editor
          .chain()
          .focus()
          .toggleHeading({ level: parseInt(value) as 1 | 2 | 3 })
          .run();
    }
  };

  if (!position.visible) {
    return null;
  }

  return (
    <div
      className="fixed bg-white dark:bg-neutral-900 border border-border p-1 rounded-xl shadow-lg transform -translate-x-1/2 flex items-center gap-1 z-[2]"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <ContentAIPopover
        selectedText={getSelectedText()}
        onSelect={handleQuickAction}
        onCustomPrompt={handleCustomPrompt}
      />

      <Separator orientation="vertical" className="h-4" />

      <Select
        onValueChange={updateHeading}
        value={
          editor.isActive("textStyle", { fontSize: "0.75em" })
            ? "smallText"
            : editor.isActive("textStyle", { fontSize: "3em" })
            ? "monsterText"
            : editor.isActive("textStyle", { fontSize: "2.5em" })
            ? "titular"
            : editor.isActive("heading", { level: 1 })
            ? "1"
            : editor.isActive("heading", { level: 2 })
            ? "2"
            : editor.isActive("heading", { level: 3 })
            ? "3"
            : editor.isActive("heading", { level: 4 })
            ? "4"
            : "paragraph"
        }
      >
        <SelectTrigger className="w-[140px] text-left h-8 focus:ring-0 border-none shadow-none ring-offset-0 hover:bg-muted">
          <SelectValue placeholder="Текст" />
        </SelectTrigger>
        <SelectContent sideOffset={4}>
          <SelectItem value="paragraph">{t("paragraph")}</SelectItem>
          <SelectItem value="smallText">{t("smallText")}</SelectItem>
          <SelectItem value="1">{t("heading1")}</SelectItem>
          <SelectItem value="2">{t("heading2")}</SelectItem>
          <SelectItem value="3">{t("heading3")}</SelectItem>
          <SelectItem value="4">{t("heading4")}</SelectItem>
          <SelectItem value="titular">{t("titular")}</SelectItem>
          <SelectItem value="monsterText">{t("monsterText")}</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-4" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive("bold"),
        })}
      >
        <Bold className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive("italic"),
        })}
      >
        <Italic className="size-3" strokeWidth={1.5} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive("underline"),
        })}
      >
        <Underline className="size-3" strokeWidth={1.5} />
      </Button>

      <TextColorPicker editor={editor} />

      <Separator orientation="vertical" className="h-4" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive("bulletList"),
        })}
      >
        <List className="size-3" strokeWidth={1.5} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive("orderedList"),
        })}
      >
        <ListOrdered className="size-3" strokeWidth={1.5} />
      </Button>

      <Separator orientation="vertical" className="h-4" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive({
              textAlign: "left",
            }),
        })}
      >
        <AlignLeft className="size-3" strokeWidth={1.5} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive({
              textAlign: "center",
            }),
        })}
      >
        <AlignCenter className="size-3" strokeWidth={1.5} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={cn({
          "p-0 size-8": true,
          "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
            editor.isActive({
              textAlign: "right",
            }),
        })}
      >
        <AlignRight className="size-3" strokeWidth={1.5} />
      </Button>

      {editor.isActive("table") && !editor.isActive("tableRow") && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="icon"
            className="p-0 size-8"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2 className="size-3" strokeWidth={1.5} />
          </Button>
        </>
      )}

      {editor.isActive("tableRow") && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="icon"
            className="p-0 size-8"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <Trash2 className="size-3" strokeWidth={1.5} />
          </Button>
        </>
      )}
    </div>
  );
};

export default FloatingMenu;
