
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useScopedI18n } from "@/lib/locales/client";

export default function EditorLoadingScreen() {
  const t = useScopedI18n("editor");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => prev + 10);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, Math.floor(Math.random() * (800 - 300 + 1)) + 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3">
      <img
        src="/slidee-colored-icon.png"
        alt="Slidee"
        className="mb-4"
        width={50}
        height={50}
      />
      <Progress value={progress} className="w-[160px]" />
      <span className="text-sm text-muted-foreground">{t("loading")}</span>
    </div>
  );
}
