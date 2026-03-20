import { Navigate, Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useI18n } from "@/lib/locales/client";
import FullPageFormWrapper from "@/components/full-page-form-warpper";
import PasswordInput from "@/components/password-input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const t = useI18n();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;
  if (session) return <Navigate to="/dashboard" replace />;

  const signInWithYandex = async () => {
    await authClient.signIn.oauth2({
      providerId: "yandex",
      callbackURL: "/dashboard",
    });
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const signIn = async () => {
    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          navigate("/dashboard");
          setIsLoading(false);
        },
        onError: (ctx: { error: { message: string } }) => {
          alert(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <FullPageFormWrapper>
      <div className="w-full pb-5 space-y-2">
        <Button
          variant="outline"
          onClick={signInWithYandex}
          className="relative w-full"
        >
          <img
            src="/icon-yandex.svg"
            alt="Yandex"
            width={24}
            height={24}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          />
          {t("signIn.signInWithYandex")}
        </Button>

        <Button
          variant="outline"
          onClick={signInWithGoogle}
          className="relative w-full"
        >
          <img
            src="/icon-google.svg"
            alt="Google"
            width={20}
            height={20}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
          />
          {t("signIn.signInWithGoogle")}
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          value={email}
          placeholder={t("signIn.emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          id="password"
          value={password}
          placeholder={t("signIn.passwordPlaceholder")}
          onChange={(value: string) => setPassword(value)}
        />

        <div className="flex items-center justify-end pb-3">
          <Link
            to="/forgot-password"
            className="text-sm text-foreground/60 hover:underline"
          >
            {t("signIn.forgotPassword")}
          </Link>
        </div>

        <Button onClick={signIn} className="w-full">
          {isLoading && (
            <Loader className="size-4 animate-spin" strokeWidth={1.5} />
          )}
          <span>{t("signIn.signInButton")}</span>
        </Button>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/sign-up")}
            className="hover:bg-primary/5 w-full"
          >
            {t("signIn.signUpButton")}
          </Button>
        </div>
      </div>
    </FullPageFormWrapper>
  );
}
