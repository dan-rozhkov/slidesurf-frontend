
import { Theme } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Copy, Trash } from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";
import { useState, useEffect } from "react";
import { ensureGoogleFontPreviewLoaded } from "@/components/theme-editor/utils";

export default function ThemeThumb({
  theme,
  isUserTheme = false,
  isSelected = false,
  onEdit,
  onCopy,
  onDelete,
}: {
  theme: Theme;
  isUserTheme?: boolean;
  isSelected?: boolean;
  onEdit?: (theme: Theme) => void;
  onCopy?: (theme: Theme) => void;
  onDelete?: (theme: Theme) => void;
}) {
  const t = useScopedI18n("themes");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<Theme | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load font preview (only "Aa" characters) when component mounts
  useEffect(() => {
    ensureGoogleFontPreviewLoaded(theme.fontFamily);
  }, [theme.fontFamily]);

  const handleDeleteClick = (theme: Theme) => {
    setThemeToDelete(theme);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (themeToDelete && onDelete) {
      onDelete(themeToDelete);
      setIsDeleteDialogOpen(false);
      setThemeToDelete(null);
    }
  };

  return (
    <div className="group">
      <div
        className={`relative aspect-video rounded-xl border shadow-sm flex overflow-hidden ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
      >
        {(isUserTheme || onCopy) && (onEdit || onDelete || onCopy) && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-md shadow"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal className="size-4" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isUserTheme && onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit?.(theme);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Pencil className="size-4" strokeWidth={1.5} />
                    <span>{t("edit")}</span>
                  </DropdownMenuItem>
                )}
                {onCopy && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCopy?.(theme);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Copy className="size-4" strokeWidth={1.5} />
                    <span>{t("copyToNew")}</span>
                  </DropdownMenuItem>
                )}
                {isUserTheme && onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(theme);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Trash className="size-4" strokeWidth={1.5} />
                    <span>{t("delete")}</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div
          className="flex w-full h-full p-4"
          style={{
            background: theme.backgroundImageUrl
              ? `url(${theme.backgroundImageUrl}) no-repeat center center / cover`
              : theme.colors?.background,
          }}
        >
          <div
            className="flex gap-3 w-full p-4 rounded-sm"
            style={{
              background: theme.colors?.card?.background,
            }}
          >
            {/* Font preview */}
            <div
              className="text-2xl font-semibold shrink-0"
              style={{
                color: theme.colors?.card?.foreground,
                fontFamily: `'${theme.fontFamily
                  .split(",")[0]
                  ?.trim()} Preview', ${theme.fontFamily}`,
              }}
            >
              Аа
            </div>

            <div className="flex flex-col gap-1 grow">
              <div
                className="w-full h-1 rounded-sm opacity-50 shrink-0"
                style={{ background: theme.colors?.card?.foreground }}
              />

              <div
                className="w-[90%] h-1 rounded-sm opacity-50 shrink-0"
                style={{ background: theme.colors?.card?.foreground }}
              />

              <div
                className="w-8 h-2 rounded-sm mt-1 shrink-0"
                style={{ background: theme.colors?.accent }}
              />
            </div>
          </div>
        </div>

        {/* Color palette indicator */}
        <div className="absolute bottom-0 right-0 left-0 flex items-center justify-center gap-0.5">
          <div
            className="w-full h-1"
            style={{ background: theme.colors?.card?.background }}
          />

          <div
            className="w-full h-1"
            style={{ background: theme.colors.accent }}
          />

          <div
            className="w-full h-1"
            style={{ background: theme.colors?.card?.foreground }}
          />
        </div>
      </div>

      <span className="text-xs text-muted-foreground">{theme.name}</span>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTheme")}</DialogTitle>
            <DialogDescription>
              {t("deleteThemeConfirmation", { name: themeToDelete?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("editor.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
