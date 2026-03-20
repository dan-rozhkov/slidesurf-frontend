import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { useScopedI18n } from "@/lib/locales/client";
import { PricingGrid } from "@/components/landing/pricing-grid";

export default function PricingPage() {
  const tp = useScopedI18n("landing.pricingPlans");

  return (
    <div className="grid bg-background relative">
      <Header />

      <section className="relative col-span-full text-foreground overflow-hidden min-h-dvh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col gap-4 sm:gap-6 pt-24 sm:pt-32 md:pt-52 text-center items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold tracking-tight leading-[110%] max-w-4xl mx-auto">
              {tp("title")}
            </h1>
            <p className="text-base sm:text-lg text-foreground/60 max-w-2xl text-balance mx-auto">
              {tp("description")}
            </p>
          </div>

          <div className="relative pt-12 sm:pt-16 md:pt-20">
            <PricingGrid />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
