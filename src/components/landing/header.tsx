import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";

export default function Header() {
  const t = useScopedI18n("landing");

  return (
    <header className="col-span-full fixed top-4 left-0 right-0 z-10">
      <div className="max-w-sm sm:max-w-2xl mx-auto flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-muted/90 backdrop-blur-xl rounded-full overflow-hidden">
        <Link to="/" className="outline-none relative left-1 sm:left-1.5">
          <img
            src="/slidee-colored-logo.png"
            alt="Слайди | Сервис для генерации презентаций с помощью ИИ"
            width={120}
            height={18}
            className="w-24 sm:w-32 md:w-36"
          />
        </Link>
        <Link to="/sign-in">
          <Button className="rounded-full px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base h-auto font-medium">
            {t("createPresentation")}
          </Button>
        </Link>
      </div>
    </header>
  );
}
