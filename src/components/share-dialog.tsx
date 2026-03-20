
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Presentation } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Link,
  Download,
  Unlink,
  BarChart,
  FileText,
  Presentation as PresentationIcon,
  Users,
} from "lucide-react";
import { updatePresentation } from "@/api/presentations";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { SoonBadge } from "./soon-badge";
import { useScopedI18n } from "@/lib/locales/client";
import { usePptxExport } from "@/lib/hooks/use-pptx-export";
import { ShareWithTeamContent } from "./teams/share-with-team-content";
import { InstallFontsAlert } from "./install-fonts-alert";

export default function ShareDialog({
  presentation,
}: {
  presentation: Presentation;
}) {
  const t = useScopedI18n("editor");
  const [isOpen, setIsOpen] = useState(false);
  const [, setPresentationAtom] = usePresentationAtom();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const link = useMemo(
    () => (origin ? `${origin}/present/${presentation.id}` : ""),
    [origin, presentation.id]
  );
  const navigate = useNavigate();
  const { exportToPPTX, isExporting, themeFonts } = usePptxExport();

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCopied || !link) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
    }
    setIsCopied(true);
    toast.info(t("linkCopied"));

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleShare = async (value: string) => {
    try {
      setIsLoading(true);

      const updatedPresentation = await updatePresentation(presentation.id, {
        isShared: value === "enable",
      });

      if (updatedPresentation) {
        setPresentationAtom(updatedPresentation);
      }

      toast.info(value === "enable" ? t("enableLink") : t("disableLink"));
    } catch (error: unknown) {
      console.error(error);
      toast.error(t("errorUpdatingPresentation"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Download className="!size-5" strokeWidth={1.5} />
          {t("download")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("share")}</DialogTitle>
          <DialogDescription>{t("shareDescription")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export">
          <TabsList className="mb-4 w-full h-auto">
            <TabsTrigger value="link" className="w-full flex-col py-2 gap-1">
              <Link className="w-4 h-4 mr-2" strokeWidth={1.5} />
              <span className="text-xs">{t("link")}</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="w-full flex-col py-2 gap-1">
              <Users className="w-4 h-4 mr-2" strokeWidth={1.5} />
              <span className="text-xs">{t("collaborators")}</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="w-full flex-col py-2 gap-1">
              <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
              <span className="text-xs">{t("download")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link">
            <div className="flex flex-col gap-4">
              <div
                className={cn(
                  isLoading && "opacity-50",
                  "flex items-center gap-3 justify-between"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                    {presentation.isShared ? (
                      <Link className="size-5" strokeWidth={1.5} />
                    ) : (
                      <Unlink className="size-5" strokeWidth={1.5} />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-medium tracking-tight">
                      {t("anyoneWithLink")}
                    </p>
                    {presentation.isShared ? (
                      <p className="text-xs text-muted-foreground">
                        {t("canViewPresentation")}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t("linkDisabled")}
                      </p>
                    )}
                  </div>
                </div>

                <Select
                  disabled={isLoading}
                  value={presentation.isShared ? "enable" : "disable"}
                  onValueChange={handleShare}
                >
                  <SelectTrigger className="w-auto border-none hover:bg-accent">
                    <SelectValue placeholder="Выберите действие" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enable">{t("allowAccess")}</SelectItem>
                    <SelectItem value="disable">{t("denyAccess")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {presentation.isShared && (
                <div className="flex flex-col gap-2 py-2">
                  <Label>{t("link")}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={link}
                      onFocus={(e) => e.target.select()}
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      size="icon"
                      className="shrink-0"
                    >
                      {isCopied ? (
                        <Check className="size-4" strokeWidth={1.5} />
                      ) : (
                        <Copy className="size-4" strokeWidth={1.5} />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="teams">
            <ShareWithTeamContent
              presentationId={presentation.id}
              presentationTitle={presentation.title}
            />
          </TabsContent>

          <TabsContent value="export">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-b-none"
                  onClick={() => navigate(`/export/${presentation.id}`)}
                >
                  <FileText className="size-4 mr-2" strokeWidth={1.5} />
                  {t("downloadPDF")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start rounded-t-none -mt-px"
                  onClick={exportToPPTX}
                  disabled={isExporting}
                >
                  <PresentationIcon className="size-4 mr-2" strokeWidth={1.5} />
                  {t("downloadPPTX")}
                </Button>
              </div>

              {themeFonts.length > 0 && <InstallFontsAlert fonts={themeFonts} />}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-border -mx-6 px-6 pt-4 -mb-2 flex sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="font-normal -ml-2"
            onClick={() => navigate(`/analytics/${presentation.id}`)}
          >
            <BarChart className="size-4" strokeWidth={1.5} />
            {t("viewAnalytics")}
            <SoonBadge />
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
