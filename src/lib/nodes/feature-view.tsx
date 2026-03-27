
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { FeatureAttributes } from "./feature";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2, SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNodeHasFocus } from "@/lib/hooks/use-node-has-focus";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Node } from "prosemirror-model";

export const FeatureView = ({
  node,
  getPos,
  editor,
  deleteNode,
  updateAttributes,
}: NodeViewProps) => {
  const attrs = node.attrs as FeatureAttributes;
  const [isFocused, setIsFocused] = useState(false);
  const hasFocus = useNodeHasFocus(editor, getPos, node.nodeSize);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [title, setTitle] = useState(attrs.title);
  const [content, setContent] = useState(attrs.content);

  // Get the parent node via editor state
  const pos = getPos();
  let parentNode: Node | null = null;
  if (typeof pos === "number" && pos > 0) {
    try {
      parentNode = editor.state.doc.resolve(pos).parent;
    } catch {
      parentNode = null;
    }
  }

  // Get the index of the current feature
  let featureIndex = 1;
  if (typeof pos === "number" && pos > 0 && parentNode) {
    try {
      const resolvedPos = editor.state.doc.resolve(pos);
      const parentPos = resolvedPos.before();
      const parentNodeAtPos = editor.state.doc.nodeAt(parentPos);

      if (parentNodeAtPos) {
        // Get the index of the current node among the children of the parent node
        let index = 0;
        parentNodeAtPos.forEach((child) => {
          if (child === node) {
            featureIndex = index + 1;
          }
          index++;
        });
      }
    } catch {
      // Safely ignore the error
      featureIndex = 1;
    }
  }

  const handleSave = () => {
    updateAttributes({
      title,
      content,
    });
    setIsEditDialogOpen(false);
  };

  return (
    <NodeViewWrapper
      className={cn(
        "group/feature relative",
        hasFocus && "outline outline-border",
        isFocused && "outline outline-primary outline-2 hover:outline-primary"
      )}
    >
      <div
        className={cn(
          "absolute top-[-1.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/feature:opacity-100",
          (isFocused || hasFocus) && "opacity-100"
        )}
      >
        <Popover onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none",
                isFocused &&
                  "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2"
              )}
            >
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <SquarePen className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteNode}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className="flex items-start w-full relative group/feature"
        contentEditable={false}
        onClick={() => setIsEditDialogOpen(true)}
      >
        <div
          className="flex items-start border-b relative w-full"
          style={{
            borderColor: "var(--slide-accent)",
          }}
        >
          <div
            className="absolute bottom-0 left-0 w-px h-[50%]"
            style={{
              backgroundColor: "var(--slide-accent)",
            }}
          />

          <p
            className="-translate-x-1/2"
            style={{
              color: "var(--slide-accent)",
              fontSize: "3em",
              lineHeight: "0.8em",
              fontWeight: 700,
            }}
          >
            {featureIndex}
          </p>

          <div className="flex flex-col items-start gap-[0.2em] flex-1">
            <div className="flex items-center gap-[1em] w-full">
              <h4
                className="font-bold uppercase tracking-wide leading-none !m-0 inline-flex items-center px-[0.75em] py-[0.25em] rounded-full border"
                style={{
                  borderColor: "var(--slide-accent)",
                  fontSize: "0.8em",
                }}
              >
                {attrs.title}
              </h4>
            </div>
            <p
              style={{
                fontSize: "0.9em",
                margin: 0,
                paddingBottom: "0.4em",
              }}
            >
              {attrs.content}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать фичу</DialogTitle>
            <DialogDescription>
              Измените заголовок и описание фичи
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Заголовок</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите заголовок"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Введите описание"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  );
};
