
import { cn } from "@/lib/utils";
import { AnimatedMarkdown } from "flowtoken";
import "flowtoken/dist/styles.css";
import { Message as MessageType } from "@/types";
import MessageActions from "@/components/chat/message-actions";
import { useScopedI18n } from "@/lib/locales/client";

export default function Message({
  message,
  animation = null,
}: {
  message: MessageType;
  animation?: string | null;
}) {
  const t = useScopedI18n("chat");

  return (
    <div
      className={cn(
        "flex w-full flex-wrap space-y-1 group/message",
        message.role === "user" && "justify-end"
      )}
    >
      {message.role === "assistant" && (
        <p className="text-sm text-muted-foreground w-full">{t("title")}</p>
      )}
      <div
        className={cn(
          "flex prose lg:prose-md prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent",
          message.role === "user" && "max-w-[70%]"
        )}
      >
        {message.role === "user" ? (
          <div className="py-3 px-4 border border-border rounded-lg bg-background text-sm leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="prose lg:prose-md prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent [&>p+p]:pt-3 [&>h3]:pt-3 [&>hr]:my-3 [&>ul>li]:py-1 text-sm leading-relaxed">
            <AnimatedMarkdown animation={animation} content={message.content} />
          </div>
        )}
      </div>
      <MessageActions message={message} />
    </div>
  );
}
