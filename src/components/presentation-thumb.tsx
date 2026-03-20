/* eslint-disable @next/next/no-img-element */

import { Presentation } from "@/types";
import {
  Copy,
  Lock,
  MoreHorizontal,
  ArchiveRestore,
  SquarePen,
  Trash,
  Globe,
} from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createPresentation,
  deletePresentation,
  restorePresentation,
  toTrash,
  updatePresentation,
} from "@/api/presentations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RenamePresentationForm } from "./rename-presentation-form";
import { useScopedI18n } from "@/lib/locales/client";
import { cn } from "@/lib/utils";

const DEFAULT_THUMBNAIL = "/presentation-thumb.png";

function VisibilityBadge({ isShared }: { isShared?: boolean }) {
  const t = useScopedI18n("presentationThumb");

  return (
    <span className="text-xs text-neutral-500 flex items-center gap-1 px-2 py-1 rounded-md bg-accent">
      {isShared ? (
        <>
          <Globe className="size-3" strokeWidth={1.5} />
          {t("public")}
        </>
      ) : (
        <>
          <Lock className="size-3" strokeWidth={1.5} />
          {t("private")}
        </>
      )}
    </span>
  );
}

function PopoverAction({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="cursor-pointer flex items-center text-sm gap-3 [&_svg]:size-4 [&_svg]:shrink-0 gap-4 px-3 py-2.5 rounded-lg hover:bg-accent text-accent-foreground"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}

export default function PresentationThumb({
  presentation,
}: {
  presentation: Presentation;
}) {
  const t = useScopedI18n("presentationThumb");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isDeleted = presentation?.isDeleted;
  const navigate = useNavigate();

  const invalidatePresentations = () => {
    queryClient.invalidateQueries({ queryKey: ["presentations"] });
    queryClient.invalidateQueries({ queryKey: ["deleted-presentations"] });
    queryClient.invalidateQueries({ queryKey: ["shared-presentations"] });
  };

  const thumbnailUrl = `${import.meta.env.VITE_AWS_ENDPOINT}/${import.meta.env.VITE_AWS_BUCKET_NAME}/${presentation.id}/preview.png`;
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Ref callback to handle cached images that load before React attaches onLoad
  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node?.complete && node.naturalHeight !== 0) {
      setIsImageLoading(false);
    }
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = DEFAULT_THUMBNAIL;
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleThumbnailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/editor/${presentation.id}`);
  };

  const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((state) => !state);
  };

  return (
    <>
      <Link
        key={presentation.id}
        to={`/editor/${presentation.id}`}
        className="bg-white dark:bg-neutral-900 rounded-xl border border-border shadow-sm cursor-pointer hover:bg-accent/50 transition-colors outline-none flex flex-col justify-stretch focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open presentation: ${presentation.title}`}
      >
        <div
          className="aspect-video bg-accent flex items-center justify-center rounded-t-xl user-select-none overflow-hidden shrink-0 relative"
          onClick={handleThumbnailClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              handleThumbnailClick(e as unknown as React.MouseEvent);
            }
          }}
        >
          <img
            ref={setImgRef}
            src={thumbnailUrl}
            alt={presentation.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-200",
              isImageLoading ? "opacity-0" : "opacity-100",
            )}
            width={380}
            height={214}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent animate-pulse">
              <div className="w-8 h-8 border-2 border-border border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4 pb-2 items-start grow-1 h-full justify-between">
          <span className="font-semibold text-sm truncate max-w-full">
            {presentation.title}
          </span>

          <div className="flex items-center justify-between w-full">
            <VisibilityBadge isShared={presentation.isShared} />

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMoreClick}
                  aria-label="More options"
                >
                  <MoreHorizontal className="size-4" strokeWidth={1.5} />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                className="p-1 w-[200px]"
              >
                {!isDeleted && (
                  <>
                    <PopoverAction
                      onClick={() => {
                        setOpen(false);
                        setOpenRenameDialog(true);
                      }}
                    >
                      <SquarePen className="size-4" strokeWidth={1.5} />
                      <span>{t("rename")}</span>
                    </PopoverAction>

                    <PopoverAction
                      onClick={async () => {
                        setOpen(false);
                        await createPresentation({
                          title: `${presentation.title} (копия)`,
                          themeId: presentation.themeId,
                          slides: presentation.slides,
                        });
                        invalidatePresentations();
                      }}
                    >
                      <Copy className="size-4" strokeWidth={1.5} />
                      <span>{t("duplicate")}</span>
                    </PopoverAction>

                    <PopoverAction
                      onClick={async () => {
                        setOpen(false);
                        await toTrash(presentation.id);
                        invalidatePresentations();
                      }}
                    >
                      <Trash className="size-4" strokeWidth={1.5} />
                      <span>{t("trash")}</span>
                    </PopoverAction>
                  </>
                )}

                {isDeleted && (
                  <>
                    <PopoverAction
                      onClick={async () => {
                        setOpen(false);
                        await restorePresentation(presentation.id);
                        invalidatePresentations();
                      }}
                    >
                      <ArchiveRestore className="size-4" strokeWidth={1.5} />
                      <span>{t("restore")}</span>
                    </PopoverAction>

                    <PopoverAction
                      onClick={async () => {
                        setOpen(false);
                        await deletePresentation(presentation.id);
                        invalidatePresentations();
                      }}
                    >
                      <Trash className="size-4" strokeWidth={1.5} />
                      <span>{t("deleteAlways")}</span>
                    </PopoverAction>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Link>

      <Dialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("rename")}</DialogTitle>
          </DialogHeader>

          <RenamePresentationForm
            presentation={presentation}
            onSubmit={async (title) => {
              setOpenRenameDialog(false);
              await updatePresentation(presentation.id, { title }, true);
              invalidatePresentations();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
