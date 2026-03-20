
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type AdsBannerProps = {
  promoCode: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc?: string;
};

export function AdsBanner({
  promoCode,
  title,
  description,
  buttonText,
  imageSrc = "/banners/black-sale-ad.svg",
}: AdsBannerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 min-h-[100px]">
      <div className="flex justify-start gap-4 items-center w-full bg-[#171717] rounded-xl overflow-hidden pl-2 pr-8">
        <img src={imageSrc} alt="sale" width={170} height={100} />

        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-white text-xl font-semibold">{title}</h3>
          <p className="text-white text-sm opacity-80">{description}</p>
        </div>

        <Button
          variant="outline"
          className="bg-transparent border-2 border-white text-white shrink-0"
          asChild
        >
          <Link to={`/settings?tab=subscription&promoCode=${promoCode}`}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
