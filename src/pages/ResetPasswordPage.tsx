import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle } from "lucide-react";
import FullPageFormWrapper from "@/components/full-page-form-warpper";
import { toast } from "sonner";
import { useI18n } from "@/lib/locales/client";
import PasswordInput from "@/components/password-input";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = useI18n();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam === "INVALID_TOKEN") {
      setError(t("resetPassword.errors.invalidToken"));
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(t("resetPassword.errors.noTokenProvided"));
    }
  }, [searchParams, t]);

  const handleResetPassword = async () => {
    if (!token) {
      toast.error(t("resetPassword.errors.noToken"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("resetPassword.errors.passwordsMismatch"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("resetPassword.errors.passwordTooShort"));
      return;
    }

    setIsLoading(true);
    try {
      await authClient.resetPassword({ newPassword, token });
      setIsSuccess(true);
      toast.success(t("resetPassword.successMessage"));
      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(t("resetPassword.errors.resetFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <FullPageFormWrapper>
        <div className="flex flex-col gap-2 text-center pb-4">
          <h1 className="text-xl font-semibold">
            {t("resetPassword.resetFailed")}
          </h1>
          <p className="text-sm text-foreground/80">{error}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/forgot-password")}
          className="w-full"
        >
          {t("resetPassword.requestNewLink")}
        </Button>
      </FullPageFormWrapper>
    );
  }

  if (isSuccess) {
    return (
      <FullPageFormWrapper>
        <div className="flex flex-col gap-2 text-center pb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold">
            {t("resetPassword.resetSuccess")}
          </h1>
          <p className="text-sm text-foreground/80">
            {t("resetPassword.successMessage")}
          </p>
          <p className="text-xs text-foreground/60">
            {t("resetPassword.redirectingMessage")}
          </p>
        </div>
      </FullPageFormWrapper>
    );
  }

  return (
    <FullPageFormWrapper>
      <div className="flex flex-col gap-2 text-center pb-4">
        <h1 className="text-xl font-semibold">{t("resetPassword.title")}</h1>
        <p className="text-sm text-foreground/80">
          {t("resetPassword.subtitle")}
        </p>
      </div>
      <div className="space-y-2">
        <PasswordInput
          id="newPassword"
          value={newPassword}
          placeholder={t("resetPassword.newPasswordPlaceholder")}
          onChange={(value: string) => setNewPassword(value)}
        />
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          placeholder={t("resetPassword.confirmPasswordPlaceholder")}
          onChange={(value: string) => setConfirmPassword(value)}
        />
        <Button
          onClick={handleResetPassword}
          className="w-full"
          disabled={isLoading || !newPassword || !confirmPassword}
        >
          {isLoading && (
            <Loader className="size-4 animate-spin mr-2" strokeWidth={1.5} />
          )}
          <span>{t("resetPassword.resetButton")}</span>
        </Button>
      </div>
    </FullPageFormWrapper>
  );
}
