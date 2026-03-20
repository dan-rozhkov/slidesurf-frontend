import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, ArrowLeft } from "lucide-react";
import FullPageFormWrapper from "@/components/full-page-form-warpper";
import { useI18n } from "@/lib/locales/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useI18n();

  const handleRequestReset = async () => {
    if (!email) {
      toast.error(t("forgotPassword.emailRequired"));
      return;
    }

    setIsLoading(true);

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setIsSuccess(true);
      toast.success(t("forgotPassword.resetLinkSent"));
    } catch (error) {
      console.error("Password reset request error:", error);
      setIsSuccess(true);
      toast.success(t("forgotPassword.resetLinkSent"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <FullPageFormWrapper>
        <div className="flex flex-col gap-2 text-center pb-4">
          <h1 className="text-xl font-semibold">
            {t("forgotPassword.successTitle")}
          </h1>
          <p className="text-sm text-foreground/80">
            {t("forgotPassword.successMessage")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/sign-in")}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("forgotPassword.backToSignIn")}
        </Button>
      </FullPageFormWrapper>
    );
  }

  return (
    <FullPageFormWrapper>
      <div className="space-y-2">
        <div className="flex flex-col gap-2 pb-4 text-center">
          <h1 className="text-xl font-semibold">{t("forgotPassword.title")}</h1>
          <p className="text-sm text-foreground/80">
            {t("forgotPassword.subtitle")}
          </p>
        </div>
        <Input
          id="email"
          type="email"
          value={email}
          placeholder={t("forgotPassword.emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          onClick={handleRequestReset}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <Loader className="size-4 animate-spin mr-2" strokeWidth={1.5} />
          )}
          <span>{t("forgotPassword.sendResetLink")}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/sign-in")}
          className="w-full hover:bg-primary/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("forgotPassword.backToSignIn")}
        </Button>
      </div>
    </FullPageFormWrapper>
  );
}
