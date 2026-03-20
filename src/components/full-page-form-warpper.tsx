
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/locales/client";

export default function FullPageFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const t = useI18n();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-[360px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex w-full flex-col items-center gap-3 px-10 py-8">
          <img
            src={
              theme === "dark"
                ? "/slidesurf-colored-logo-invert.svg"
                : "/slidesurf-colored-logo.svg"
            }
            alt="Slidesurf"
            width={140}
            height={48}
            className="object-contain"
          />
          <p className="text-sm text-foreground/80">{t("signIn.subtitle")}</p>
        </div>
        <div className="flex flex-col gap-2 bg-muted p-10">{children}</div>
      </div>

      <div className="flex w-full max-w-[260px] flex-col pt-6 text-center">
        <p className="text-xs text-foreground/50">
          {t("signIn.termsText")}{" "}
          <Link to="/offer" className="underline">
            {t("signIn.termsLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
