
import { useCopyToClipboard } from "usehooks-ts";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { WithTooltip } from "../ui/with-tooltip";
import { Message as MessageType } from "@/types";
import { useScopedI18n } from "@/lib/locales/client";

function MessageActions({ message }: { message: MessageType }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const t = useScopedI18n("chat");

  return (
    <div className="flex items-center gap-1 w-full">
      {message?.role === "assistant" && (
        <>
          <WithTooltip
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => {
                  copyToClipboard(message.content).then(() => setCopied(true));
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? (
                  <Check className="size-4" strokeWidth={1.5} />
                ) : (
                  <Copy className="size-4" strokeWidth={1.5} />
                )}
              </Button>
            }
            display={t("copy")}
            side="bottom"
          />

          <Button variant="ghost" size="icon" className="size-7">
            <ThumbsUp className="size-4" strokeWidth={1.5} />
          </Button>

          <Button variant="ghost" size="icon" className="size-7">
            <ThumbsDown className="size-4" strokeWidth={1.5} />
          </Button>
        </>
      )}
    </div>
  );
}

MessageActions.displayName = "MessageActions";

export default memo(MessageActions);
