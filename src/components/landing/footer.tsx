import { Link } from "react-router-dom";
import { useScopedI18n } from "@/lib/locales/client";

export default function Footer() {
  const t = useScopedI18n("landing");

  return (
    <footer className="pt-4 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to="/privacy">
            {t("privacy")}
          </Link>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to="/offer">
            {t("offer")}
          </Link>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} {t("name")}
        </span>
      </div>
    </footer>
  );
}
