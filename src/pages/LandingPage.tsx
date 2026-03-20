import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Languages, Presentation } from "lucide-react";
import ChatGptLogo from "@/components/landing/chat-gpt-logo";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { useScopedI18n } from "@/lib/locales/client";

export default function LandingPage() {
  const t = useScopedI18n("landing");

  return (
    <div className="grid bg-background relative">
      <Header />

      <section className="relative col-span-full text-foreground overflow-hidden min-h-dvh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col gap-6 sm:gap-10 pt-24 sm:pt-32 md:pt-52">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[110%] text-balance text-center">
              {t("titlePart1")}
              <br />
              {t("titlePart2")}
            </h1>
            <p className="text-base sm:text-lg text-foreground/60 text-balance text-center max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="pt-16 pb-10">
            <div
              className="bg-muted"
              style={{
                position: "relative",
                paddingTop: "61.5%",
                width: "100%",
                borderRadius: "0.8rem",
              }}
            >
              <iframe
                src="https://kinescope.io/embed/smHiWvFQYaVxs9EuLYKKAD?autoplay=1"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                allowFullScreen
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
              ></iframe>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4 py-4">
            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row items-start sm:items-center">
              <ChatGptLogo className="size-8 sm:size-10 shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-foreground text-sm sm:text-md font-bold tracking-tight">
                  {t("gpt4oAndFlux")}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm leading-tight">
                  {t("latestModelsDescription")}
                </span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row items-start sm:items-center">
              <Languages
                className="size-8 sm:size-10 shrink-0"
                strokeWidth={1}
              />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-foreground text-sm sm:text-md font-bold tracking-tight">
                  {t("multilingualism")}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm leading-tight">
                  {t("multilingualismDescription")}
                </span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row items-start sm:items-center">
              <Globe className="size-8 sm:size-10 shrink-0" strokeWidth={1} />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-foreground text-sm sm:text-md font-bold tracking-tight">
                  {t("accessByLink")}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm leading-tight">
                  {t("accessByLinkDescription")}
                </span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row items-start sm:items-center">
              <Presentation
                className="size-8 sm:size-10 shrink-0"
                strokeWidth={1}
              />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-foreground text-sm sm:text-md font-bold tracking-tight">
                  {t("exportToPDF")}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm leading-tight">
                  {t("exportToPDFDescription")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 sm:py-10 flex gap-4 justify-center px-4">
          <Button
            asChild
            className="text-white bg-gradient-to-r from-pink-500 to-orange-400 focus:outline-none rounded-full text-center py-3 px-6 sm:px-10 sm:text-md text-base sm:h-16 h-12 min-w-fit"
          >
            <Link to="/dashboard">{t("createPresentationForFree")}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
