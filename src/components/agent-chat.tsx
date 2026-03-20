
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  AtSign,
  X,
  CopyIcon,
  RefreshCcwIcon,
  Trash2,
  MessageCircle,
  PencilLine,
  SpellCheck2,
  Languages,
  ListRestart,
  List,
  ListCollapse,
} from "lucide-react";
import { useCurrentSlideIdAtom } from "@/lib/hooks/use-current-slide-id";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useIsPresentingAtom } from "@/lib/hooks/use-is-presenting";
import { cn } from "@/lib/utils";
import { useMemo, useEffect, useCallback, useRef, Fragment } from "react";
import { useScopedI18n } from "@/lib/locales/client";
import { useChatOpenAtom } from "@/lib/hooks/use-chat-open";
import { useChat } from "@ai-sdk/react";
import type { ToolUIPart } from "ai";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { useAgentPromptAtom } from "@/lib/hooks/use-agent-prompt";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Badge } from "@/components/ui/badge";

export default function AgentChat() {
  const [currentSlideId] = useCurrentSlideIdAtom();
  const [presentation, setPresentation] = usePresentationAtom();
  const t = useScopedI18n("chat");
  const tEditor = useScopedI18n("editor");
  const [, setIsChatOpen] = useChatOpenAtom();
  const [, setIsPresenting] = useIsPresentingAtom();
  const [agentPrompt, setAgentPrompt] = useAgentPromptAtom();
  const { data: session } = authClient.useSession();
  const isProcessingPromptRef = useRef(false);

  const currentSlideIndex = useMemo(() => {
    return (
      presentation?.slides.findIndex((slide) => slide.id === currentSlideId) + 1
    );
  }, [presentation, currentSlideId]);

  const userName = session?.user?.name || session?.user?.email;

  const suggestionCommands = useMemo(
    () => [
      { id: "improveText", label: tEditor("improveText"), icon: PencilLine },
      { id: "spellCheck", label: tEditor("spellCheck"), icon: SpellCheck2 },
      {
        id: "translateToRussian",
        label: tEditor("translateToRussian"),
        icon: Languages,
      },
      {
        id: "writeMoreDetailed",
        label: tEditor("writeMoreDetailed"),
        icon: ListRestart,
      },
      { id: "shortenText", label: tEditor("shortenText"), icon: ListRestart },
      { id: "splitIntoItems", label: tEditor("splitIntoItems"), icon: List },
      {
        id: "splitIntoSections",
        label: tEditor("splitIntoSections"),
        icon: ListCollapse,
      },
    ],
    [tEditor]
  );

  const { messages, sendMessage, status, regenerate, setMessages } = useChat({
    onFinish: ({ messages: allMessages }) => {
      // Find updateSlideContent tool results
      const updateResults: Array<{
        slideId: string;
        content: string;
        slideIndex: number;
      }> = [];

      allMessages.forEach((msg) => {
        msg.parts.forEach((part: any) => {
          // Check for tool-updateSlideContent with output
          if (
            part.type === "tool-updateSlideContent" &&
            part.output &&
            part.state === "output-available"
          ) {
            try {
              const result =
                typeof part.output === "string"
                  ? JSON.parse(part.output)
                  : part.output;

              if (
                result &&
                !result.error &&
                result.slideId &&
                result.content !== undefined
              ) {
                updateResults.push({
                  slideId: result.slideId,
                  content: result.content,
                  slideIndex: result.slideIndex,
                });
              }
            } catch (e) {
              console.error("Failed to parse tool output:", e);
            }
          }
        });
      });

      // Apply updates to local presentation state
      if (updateResults.length > 0 && presentation) {
        const updatedSlides = [...presentation.slides];

        updateResults.forEach((update) => {
          const slideIndex = updatedSlides.findIndex(
            (slide) => slide.id === update.slideId
          );

          if (slideIndex !== -1) {
            updatedSlides[slideIndex] = {
              ...updatedSlides[slideIndex],
              content: update.content,
            };
          }
        });

        // Update local state (preserves undo functionality)
        setPresentation({
          ...presentation,
          slides: updatedSlides,
        });

        // Trigger visual re-render
        setIsPresenting(true);
        setTimeout(() => {
          setIsPresenting(false);
        }, 100);
      }
    },
  });

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text);
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      sendMessage(
        {
          text: message.text || "Sent with attachments",
          files: message.files,
        },
        {
          body: {
            webSearch: true,
            slideId: currentSlideId,
            presentationId: presentation?.id,
          },
        }
      );
    },
    [currentSlideId, presentation?.id, sendMessage]
  );

  const handleSuggestionSelect = (suggestion: string) => {
    handleSubmit({ text: suggestion, files: [] });
  };

  useEffect(() => {
    if (!agentPrompt || isProcessingPromptRef.current) {
      return;
    }

    isProcessingPromptRef.current = true;

    sendMessage(
      {
        text: agentPrompt,
        files: [],
      },
      {
        body: {
          webSearch: true,
          slideId: currentSlideId,
          presentationId: presentation?.id,
        },
      }
    );

    setAgentPrompt(null);
    setIsChatOpen(true);

    // Reset flag after a small delay to allow state updates
    setTimeout(() => {
      isProcessingPromptRef.current = false;
    }, 100);
  }, [
    agentPrompt,
    sendMessage,
    currentSlideId,
    presentation?.id,
    setAgentPrompt,
    setIsChatOpen,
  ]);

  return (
    <div className="flex flex-col w-[400px] shrink-0">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-md font-semibold tracking-tight flex items-center gap-1.5">
          {t("title")}
          <Badge variant="outline" className="text-xs relative font-normal">
            {t("beta")}
          </Badge>
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMessages([])}
            title={t("clear")}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsChatOpen(false)}
          >
            <X className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="px-4 pb-4 space-y-3 flex-1">
          <ConversationEmptyState
            title={t("welcomeUser", { name: userName || t("welcomeFallback") })}
            description={t("startConversation")}
            icon={<MessageCircle className="size-4" />}
          >
            <div className="pt-10 flex flex-col gap-2 items-center justify-center">
              {suggestionCommands.map((command) => (
                <Suggestion
                  key={command.id}
                  suggestion={command.label}
                  onClick={() => handleSuggestionSelect(command.label)}
                  variant="secondary"
                  size="sm"
                  className="inline-flex gap-2 rounded-full bg-muted text-primary hover:bg-muted/80 border-0"
                >
                  <command.icon
                    className="size-4 text-primary"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm  font-normal text-primary">
                    {command.label}
                  </span>
                </Suggestion>
              ))}
            </div>
          </ConversationEmptyState>
        </div>
      ) : (
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.map((message) => {
              // Collect sources from both source-url parts and webSearch tool results
              const sources: Array<{ url: string; title?: string }> = [];

              message.parts.forEach((part) => {
                // Sources from webSearch tool
                if (
                  part.type === "tool-webSearch" &&
                  part.output &&
                  part.state === "output-available"
                ) {
                  try {
                    const result =
                      typeof part.output === "string"
                        ? JSON.parse(part.output)
                        : part.output;
                    if (result.sources && Array.isArray(result.sources)) {
                      result.sources.forEach((source: any) => {
                        if (source.url) {
                          sources.push({
                            url: source.url,
                            title: source.title || source.url,
                          });
                        }
                      });
                    }
                  } catch (e) {
                    console.error("Failed to parse webSearch tool output:", e);
                  }
                }
              });

              return (
                <Fragment key={message.id}>
                  {message.role === "assistant" && sources.length > 0 && (
                    <Sources>
                      <SourcesTrigger count={sources.length} />
                      {sources.map((source, i) => (
                        <SourcesContent key={`${message.id}-source-${i}`}>
                          <Source
                            href={source.url}
                            title={source.title || source.url}
                          />
                        </SourcesContent>
                      ))}
                    </Sources>
                  )}
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message
                            key={`${message.id}-${i}`}
                            from={message.role}
                          >
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                            {message.role === "assistant" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id && (
                                <MessageActions>
                                  <MessageAction
                                    onClick={() => regenerate()}
                                    label="Retry"
                                  >
                                    <RefreshCcwIcon
                                      className="size-3"
                                      strokeWidth={1.5}
                                    />
                                  </MessageAction>
                                  <MessageAction
                                    onClick={() =>
                                      navigator.clipboard.writeText(part.text)
                                    }
                                    label={t("copy")}
                                  >
                                    <CopyIcon
                                      className="size-3"
                                      strokeWidth={1.5}
                                    />
                                  </MessageAction>
                                </MessageActions>
                              )}
                          </Message>
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        // Handle tool parts (tool-* types)
                        if (part.type.startsWith("tool-")) {
                          const toolPart = part as ToolUIPart;
                          return (
                            <Tool
                              key={`${message.id}-${i}`}
                              defaultOpen={false}
                            >
                              <ToolHeader
                                type={toolPart.type}
                                state={toolPart.state}
                              />
                              <ToolContent>
                                {"input" in toolPart &&
                                  toolPart.input !== undefined && (
                                    <ToolInput input={toolPart.input} />
                                  )}
                                {("output" in toolPart ||
                                  "errorText" in toolPart) && (
                                  <ToolOutput
                                    output={
                                      "output" in toolPart
                                        ? toolPart.output
                                        : undefined
                                    }
                                    errorText={
                                      "errorText" in toolPart
                                        ? toolPart.errorText
                                        : undefined
                                    }
                                  />
                                )}
                              </ToolContent>
                            </Tool>
                          );
                        }
                        return null;
                    }
                  })}
                </Fragment>
              );
            })}
            {status === "submitted" && (
              <div className="size-1 rounded-sm h-4 bg-primary animate-pulse" />
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div className="p-4 pt-0">
        <PromptInput onSubmit={handleSubmit} multiple>
          <PromptInputBody>
            <PromptInputTextarea placeholder={t("placeholder")} autoFocus />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {currentSlideId && (
                <PromptInputButton
                  variant="ghost"
                  className={cn(
                    currentSlideId && "border border-border h-auto py-1.5"
                  )}
                >
                  <AtSign className="size-4" strokeWidth={1.5} />
                  <span className="text-xs">
                    {t("slide")} {currentSlideIndex}
                  </span>
                </PromptInputButton>
              )}
            </PromptInputTools>
            <PromptInputSubmit
              disabled={status === "submitted"}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
