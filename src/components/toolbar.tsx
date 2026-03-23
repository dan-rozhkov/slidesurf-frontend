
import { Button } from "@/components/ui/button";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import {
  House,
  Play,
  Palette,
  Undo,
  Redo,
  HelpCircle,
  Sparkles,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import ThemeThumb from "@/components/theme-thumb";
import ShareDialog from "@/components/share-dialog";
import { updatePresentation } from "@/api/presentations";
import { LastUpdateTime } from "./last-update-time";
import { useScopedI18n } from "@/lib/locales/client";
import { useUndoRedo } from "@anandarizki/use-undo-redo";
import { useIsPresentingAtom } from "@/lib/hooks/use-is-presenting";
import { useThemes } from "@/lib/hooks/use-themes";
import { useChatOpenAtom } from "@/lib/hooks/use-chat-open";
import { useSettingsOpenAtom } from "@/lib/hooks/use-settings-open";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Toolbar = () => {
  const t = useScopedI18n("editor");
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const [, setIsPresenting] = useIsPresentingAtom();
  const navigate = useNavigate();
  const { themes, isLoading: themesLoading } = useThemes();
  const [isChatOpen, setIsChatOpen] = useChatOpenAtom();
  const [isSettingsOpen, setIsSettingsOpen] = useSettingsOpenAtom();
  const [undo, redo, { canUndo, canRedo }] = useUndoRedo([
    presentationAtom,
    setPresentationAtom,
  ]);

  const handlePlay = () => {
    setPresentationAtom({
      ...presentationAtom,
      slides: presentationAtom.slides,
    });

    navigate(`/present/${presentationAtom.id}`);
  };

  const handleUndo = () => {
    setIsPresenting(true);
    undo();

    // @TODO: fix this hack
    setTimeout(() => {
      setIsPresenting(false);
    }, 100);
  };

  const handleRedo = () => {
    setIsPresenting(true);
    redo();

    setTimeout(() => {
      setIsPresenting(false);
    }, 1000);
  };

  return (
    <div className="grid px-4 py-2 w-full h-[62px] grid-cols-2">
      <div className="flex items-center gap-2">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-8 aspect-square p-0"
              onClick={() => navigate("/dashboard")}
            >
              <House className="!size-5" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {t("home")}
          </TooltipContent>
        </Tooltip>

        <div className="flex flex-col ml-2">
          <p className="text-sm font-semibold whitespace-nowrap">
            {presentationAtom.title}
          </p>
          <LastUpdateTime lastUpdate={presentationAtom?.updatedAt as Date} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center shadow-sm rounded-xl mr-2">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="size-8 aspect-square p-0 rounded-r-none -mx-px"
                onClick={handleUndo}
                disabled={!canUndo}
              >
                <Undo className="!size-5" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {t("undo")}
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="size-8 aspect-square p-0 rounded-l-none"
                onClick={handleRedo}
                disabled={!canRedo}
              >
                <Redo className="!size-5" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {t("redo")}
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild className="h-8">
              <a
                href="https://jivo.chat/iyV1mZucxo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HelpCircle className="!size-5" strokeWidth={1.5} />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {t("help")}
          </TooltipContent>
        </Tooltip>

        <Sheet>
          <Tooltip delayDuration={300}>
            <SheetTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="relative" size="sm">
                  <Palette className="!size-5" strokeWidth={1.5} />
                  {t("theme")}
                </Button>
              </TooltipTrigger>
            </SheetTrigger>
            <TooltipContent side="bottom" align="center">
              {t("themeButton")}
            </TooltipContent>
          </Tooltip>

          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t("theme")}</SheetTitle>
              <SheetDescription>{t("selectTheme")}</SheetDescription>
            </SheetHeader>

            <div className="grid grid-cols-2 gap-6 pt-6">
              {themesLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] bg-muted rounded-lg animate-pulse"
                    />
                  ))
                : themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={async () => {
                        setPresentationAtom({
                          ...presentationAtom,
                          themeId: theme.id,
                        });

                        await updatePresentation(presentationAtom.id, {
                          themeId: theme.id,
                        });
                      }}
                      className="text-left"
                    >
                      <ThemeThumb
                        theme={theme}
                        isUserTheme
                        isSelected={presentationAtom.themeId === theme.id}
                      />
                    </button>
                  ))}
            </div>
          </SheetContent>
        </Sheet>

        <ShareDialog presentation={presentationAtom} />

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8"
              onClick={() => {
                setIsSettingsOpen((v) => !v);
                if (!isSettingsOpen) setIsChatOpen(false);
              }}
            >
              <Settings className="!size-5" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {isSettingsOpen ? t("settingsClose") : t("settingsOpen")}
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="relative"
              size="sm"
              onClick={() => {
                setIsChatOpen((v) => !v);
                if (!isChatOpen) setIsSettingsOpen(false);
              }}
            >
              <Sparkles className="!size-5" strokeWidth={1.5} />
              {t("agent")}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {isChatOpen ? t("agentCloseButton") : t("agentOpenButton")}
          </TooltipContent>
        </Tooltip>

        <Button
          variant="default"
          className="gap-2 shadow-sm pr-4 ml-3 dark:bg-blue-500 dark:hover:bg-blue-500/90 dark:text-white"
          size="sm"
          onClick={handlePlay}
        >
          <Play className="!size-5" strokeWidth={1.5} />
          {t("play")}
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
