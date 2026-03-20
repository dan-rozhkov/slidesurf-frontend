
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";

type InstallFontsAlertProps = {
  fonts: string[];
};

// Generate Google Fonts download URL
function getGoogleFontsDownloadUrl(fontFamily: string): string {
  const encodedFont = fontFamily.replace(/\s+/g, "+");
  return `https://fonts.google.com/specimen/${encodedFont}`;
}

export function InstallFontsAlert({ fonts }: InstallFontsAlertProps) {
  const t = useScopedI18n("editor");

  // Filter out duplicate fonts
  const uniqueFonts = [...new Set(fonts.filter(Boolean))];

  if (uniqueFonts.length === 0) {
    return null;
  }

  const handleDownloadFont = (fontFamily: string) => {
    window.open(getGoogleFontsDownloadUrl(fontFamily), "_blank");
  };

  return (
    <Alert className="bg-muted/50 border-0">
      <AlertDescription className="text-sm">
        <p className="mb-3">{t("installFontsDescription")}</p>
        <div className="flex flex-wrap gap-2">
          {uniqueFonts.map((font) => (
            <Button
              key={font}
              variant="outline"
              size="sm"
              className="font-normal rounded-full px-2.5 py-1.5 h-auto"
              onClick={() => handleDownloadFont(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
