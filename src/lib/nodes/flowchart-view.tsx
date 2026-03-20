
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Ellipsis,
  Copy,
  Trash2,
  GripVertical,
  Plus,
  Minus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useCallback, useMemo, useRef } from "react";
import { cn } from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FlowchartNode } from "./flowchart";
import { FlowchartNodeEditor } from "./flowchart-node-editor";

// Migration function to convert old label format to new content format
const migrateNode = (node: any): FlowchartNode => {
  if (node.label && !node.content) {
    return {
      content: `<p>${node.label}</p>`,
      children: node.children?.map(migrateNode),
    };
  }
  return {
    content: node.content || "<p></p>",
    children: node.children?.map(migrateNode),
  };
};

// Deep clone helper for immutable updates
const cloneTreeData = (data: FlowchartNode[]): FlowchartNode[] => {
  return data.map((node) => ({
    content: node.content,
    children: node.children ? cloneTreeData(node.children) : undefined,
  }));
};

// Get node at path
const getNodeAtPath = (
  data: FlowchartNode[],
  path: number[]
): FlowchartNode | undefined => {
  if (path.length === 0) return undefined;
  let node: FlowchartNode | undefined = data[path[0]];
  for (let i = 1; i < path.length; i++) {
    if (!node?.children) return undefined;
    node = node.children[path[i]];
  }
  return node;
};

// Render tree recursively
const FlowchartTree = ({
  nodes,
  onNodeUpdate,
  onAddChild,
  onDeleteNode,
  canDeleteRoot,
  isEditable,
  path = [],
}: {
  nodes: FlowchartNode[];
  onNodeUpdate: (path: number[], newContent: string) => void;
  onAddChild: (path: number[]) => void;
  onDeleteNode: (path: number[]) => void;
  canDeleteRoot: boolean;
  isEditable: boolean;
  path?: number[];
}) => {
  return (
    <ul>
      {nodes.map((node, index) => {
        const currentPath = [...path, index];
        const nodePath = currentPath.join("-");
        const canDelete = path.length > 0 || canDeleteRoot;

        return (
          <li key={nodePath} className="flowchart-node-item group/node">
            <div className="flowchart-node-wrapper">
              {isEditable && (
                <div
                  className="flowchart-node-actions opacity-0 group-hover/node:opacity-100"
                  contentEditable={false}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full p-0 size-6 bg-background border-border"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddChild(currentPath);
                    }}
                    title="Добавить дочерний узел"
                    contentEditable={false}
                    type="button"
                  >
                    <Plus className="size-3" strokeWidth={1.5} />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full p-0 size-6 bg-background border-border text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteNode(currentPath);
                      }}
                      title="Удалить узел"
                      contentEditable={false}
                      type="button"
                    >
                      <Minus className="size-3" strokeWidth={1.5} />
                    </Button>
                  )}
                </div>
              )}
              <FlowchartNodeEditor
                content={node.content || "<p></p>"}
                onUpdate={(html) => onNodeUpdate(currentPath, html)}
                isEditable={isEditable}
              />
            </div>
            {node.children && node.children.length > 0 && (
              <FlowchartTree
                nodes={node.children}
                onNodeUpdate={onNodeUpdate}
                onAddChild={onAddChild}
                onDeleteNode={onDeleteNode}
                canDeleteRoot={canDeleteRoot}
                isEditable={isEditable}
                path={currentPath}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const FlowchartView = ({
  editor,
  getPos,
  node,
  selected,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Use refs to avoid stale closures in callbacks
  const editorRef = useRef(editor);
  const getPosRef = useRef(getPos);
  const nodeRef = useRef(node);

  editorRef.current = editor;
  getPosRef.current = getPos;
  nodeRef.current = node;

  const deleteFlowchart = useCallback(() => {
    const pos = getPosRef.current();
    const currentNode = nodeRef.current;
    editorRef.current
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + currentNode.nodeSize })
      .run();
  }, []);

  const cloneFlowchart = useCallback(() => {
    const pos = getPosRef.current();
    const currentNode = nodeRef.current;
    const flowchart = currentNode.toJSON();

    editorRef.current.commands.insertContentAt(pos + currentNode.nodeSize, {
      type: "flowchart",
      attrs: flowchart.attrs,
      content: flowchart.content,
    });
  }, []);

  // Update tree data with immutable operations
  const updateTreeData = useCallback(
    (updater: (data: FlowchartNode[]) => FlowchartNode[]) => {
      const pos = getPosRef.current();
      const rawData = nodeRef.current.attrs.data || [];
      const treeData = rawData.map(migrateNode);
      const updatedData = updater(cloneTreeData(treeData));

      editorRef.current
        .chain()
        .command(({ tr }) => {
          tr.setNodeMarkup(pos, undefined, { data: updatedData });
          return true;
        })
        .run();
    },
    []
  );

  const updateNodeContent = useCallback(
    (path: number[], newContent: string) => {
      updateTreeData((treeData) => {
        const node = getNodeAtPath(treeData, path);
        if (node && node.content !== newContent) {
          node.content = newContent;
        }
        return treeData;
      });
    },
    [updateTreeData]
  );

  const addChildNode = useCallback(
    (path: number[]) => {
      updateTreeData((treeData) => {
        if (path.length === 0) {
          return [...treeData, { content: "<p>Новый узел</p>" }];
        }

        const node = getNodeAtPath(treeData, path);
        if (node) {
          if (!node.children) {
            node.children = [];
          }
          node.children.push({ content: "<p>Новый узел</p>" });
        }
        return treeData;
      });
    },
    [updateTreeData]
  );

  const deleteNode = useCallback(
    (path: number[]) => {
      updateTreeData((treeData) => {
        if (path.length === 1) {
          treeData.splice(path[0], 1);
          return treeData;
        }

        const parentPath = path.slice(0, -1);
        const parent = getNodeAtPath(treeData, parentPath);
        if (parent?.children) {
          parent.children.splice(path[path.length - 1], 1);
        }
        return treeData;
      });
    },
    [updateTreeData]
  );

  const treeData = useMemo(() => {
    const data = node.attrs.data || [];
    return data.map(migrateNode);
  }, [node.attrs.data]);

  const canDeleteRoot = treeData.length > 1;

  return (
    <NodeViewWrapper
      data-type="flowchart"
      className={cn(
        "relative group/flowchart hover:outline outline-1 hover:outline-border rounded-md",
        isFocused || selected
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
    >
      <div
        contentEditable={false}
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/flowchart:opacity-100",
          (isFocused || selected) && "opacity-100"
        )}
      >
        <Popover onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none flex items-center gap-1.5",
                isFocused || selected
                  ? "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2"
                  : ""
              )}
            >
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={cloneFlowchart}>
                <Copy className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteFlowchart}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full" contentEditable={false}>
        <div className="flowchart-tree">
          {treeData.length > 0 ? (
            <FlowchartTree
              nodes={treeData}
              onNodeUpdate={updateNodeContent}
              onAddChild={addChildNode}
              onDeleteNode={deleteNode}
              canDeleteRoot={canDeleteRoot}
              isEditable={editor.isEditable}
            />
          ) : (
            <div className="text-muted-foreground text-center py-8">
              Нет данных для отображения
            </div>
          )}
        </div>
      </div>

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/flowchart:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>
    </NodeViewWrapper>
  );
};
