import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Languages, PaintBucket } from "lucide-react";
import Footer from "@/components/landing/footer";
import { useScopedI18n } from "@/lib/locales/client";

export default function LandingPage() {
  const t = useScopedI18n("landing");

  return (
    <div className="grid bg-[#0a0a0a] relative">
      <header className="col-span-full backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0 z-10 px-6 sm:px-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 sm:py-5">
          <Link to="/" className="outline-none">
            <img
              src="/slidesurf-colored-logo-invert.svg"
              alt="Slidesurf"
              width={210}
              height={20}
            />
          </Link>

          <Button
            asChild
            className="bg-white text-neutral-800 font-bold tracking-tight hover:bg-white/90 rounded-full px-4 py-2 h-auto"
          >
            <Link to="/sign-in">{t("signIn")}</Link>
          </Button>
        </div>
      </header>

      <section className="relative col-span-full text-white overflow-hidden min-h-dvh">
        <div className="max-w-7xl mx-auto px-6 sm:px-0">
          <div className="flex flex-col gap-6 sm:pt-52 pt-32">
            <h1 className="text-4xl sm:text-[58px] font-bold tracking-tighter leading-[110%]">
              {t("titlePart1")}
              <br />
              {t("titlePart2")}
            </h1>
            <p className="sm:text-lg text-md text-white/70 max-w-2xl text-balance">
              {t("description")}
            </p>
          </div>

          <div className="py-10 flex gap-4">
            <Button
              asChild
              className="bg-[#137EFE] text-white font-bold tracking-tight hover:bg-[#137EFE]/90 rounded-full sm:px-6 sm:py-3 py-1 px-4 sm:text-md text-sm h-auto"
            >
              <Link to="/dashboard">{t("createPresentation")}</Link>
            </Button>

            <Button
              asChild
              className="bg-white/5 text-white font-bold tracking-tight hover:bg-white/10 rounded-full sm:px-6 sm:py-3 py-2 px-4 sm:text-md text-sm h-auto"
            >
              <a href="#preview">{t("watchVideo")}</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 py-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <Languages className="size-10 shrink-0" strokeWidth={1} />
              <div className="flex flex-col gap-1">
                <span className="text-white text-md font-bold tracking-tight">
                  {t("multilingualism")}
                </span>
                <span className="text-white/70 text-sm leading-tight">
                  {t("multilingualismDescription")}
                </span>
              </div>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
              <Globe className="size-10 shrink-0" strokeWidth={1} />
              <div className="flex flex-col gap-1">
                <span className="text-white text-md font-bold tracking-tight">
                  {t("accessByLink")}
                </span>
                <span className="text-white/70 text-sm leading-tight">
                  {t("accessByLinkDescription")}
                </span>
              </div>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
              <PaintBucket className="size-10 shrink-0" strokeWidth={1} />
              <div className="flex flex-col gap-1">
                <span className="text-white text-md font-bold tracking-tight">
                  {t("uniqueDesign")}
                </span>
                <span className="text-white/70 text-sm leading-tight">
                  {t("wideChoiceOfTemplatesDescription")}
                </span>
              </div>
            </div>
          </div>

          <div id="preview" className="relative">
            <div className="relative flex items-start w-full sm:h-[735px] h-[200px] overflow-hidden rounded-lg mt-10 outline outline-white/20 outline-4 sm:-mb-32">
              <img
                src="/landing/editor-dark-preview.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground dark:from-transparent dark:to-background" />
            </div>

            <img
              src="/landing/editor-ai-text.jpg"
              alt=""
              width={264}
              height={219}
              className="object-contain absolute bottom-36 -left-20 rounded-lg shadow-2xl sm:block hidden"
            />

            <img
              src="/landing/editor-change-image.jpg"
              alt=""
              width={300}
              height={316}
              className="object-contain absolute top-60 -right-20 rounded-lg shadow-2xl sm:block hidden"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
