
import { Link } from "react-router-dom";
import {
  GalleryVerticalEnd,
  GalleryVertical,
  Palette,
  Search,
  Settings,
  Trash,
  HelpCircle,
  Users,
  Share2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";
import { SoonBadge } from "@/components/soon-badge";
import { GenerationsUsageCard } from "@/components/generations-usage-card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/locales/client";

export function MainNavSidebar() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = useI18n();

  return (
    <div className="flex flex-col gap-8 p-4 sticky top-0 justify-between h-dvh">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <img
            src={
              mounted && theme === "dark"
                ? "/slidee-logo-invert.png"
                : "/slidee-colored-logo.png"
            }
            className="object-contain"
            alt="Logo"
            width={140}
            height={48}
          />
        </div>

        <div className="relative">
          <Input placeholder={t("sidebar.search")} className="pl-10 h-9" />
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname === "/dashboard" && "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <GalleryVerticalEnd className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.presentations")}</span>
          </Link>

          <Link
            to="/shared"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname === "/shared" && "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <Share2 className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.sharedWithMe")}</span>
          </Link>

          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname === "/settings" && "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <Settings className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.settings")}</span>
          </Link>

          <Link
            to="/teams"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname?.startsWith("/teams") &&
                "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <Users className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.teams")}</span>
            <Badge variant="outline" className="text-xs -ml-2 relative">
              {t("sidebar.beta")}
            </Badge>
          </Link>

          <a
            href="https://jivo.chat/iyV1mZucxo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
          >
            <HelpCircle className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.help")}</span>
          </a>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Link
            to="/templates"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname === "/templates" && "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <GalleryVertical className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.templates")}</span>
            <SoonBadge className="font-normal -ml-2" />
          </Link>

          <Link
            to="/themes"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname === "/themes" && "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <Palette className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.themes")}</span>
          </Link>

          <Link
            to="/trash"
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm",
              pathname === "/trash" && "bg-neutral-100 dark:bg-neutral-800"
            )}
          >
            <Trash className="size-4" strokeWidth={1.5} />
            <span>{t("sidebar.trash")}</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <GenerationsUsageCard />
        <UserDropdown />
      </div>
    </div>
  );
}
