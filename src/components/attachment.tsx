
import { File, Loader, X } from "lucide-react";
import { Button } from "./ui/button";
import { formatBytes } from "@/lib/utils";
import { Attachment as AttachmentType } from "@/types";

export function Attachment({
  attachment,
  isUploading,
  onDeleteAttachment,
}: {
  attachment: AttachmentType;
  isUploading?: boolean;
  onDeleteAttachment?: () => void;
}) {
  return (
    <div className="inline-flex items-center justify-between gap-4 text-sm rounded-lg p-2 border border-border">
      <div className="flex items-center gap-2">
        <div
          className="size-10 rounded-md bg-accent flex items-center justify-center cursor-pointer"
          onClick={() => {
            if (isUploading) return;

            if (attachment.url) {
              window.open(attachment.url, "_blank");
            }
          }}
        >
          <File className="size-4" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm">{attachment.name}</p>
          <p className="text-xs text-gray-500">
            {formatBytes(attachment.size ?? 0)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {isUploading ? (
          <Button variant="ghost" size="icon">
            <Loader className="size-4 animate-spin" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onDeleteAttachment}
            disabled={isUploading}
          >
            <X className="size-4" strokeWidth={1.5} />
          </Button>
        )}
      </div>
    </div>
  );
}
