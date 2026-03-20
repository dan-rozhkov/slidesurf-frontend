import { Navigate, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { nanoid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/locales/client";
import FullPageFormWrapper from "@/components/full-page-form-warpper";
import PasswordInput from "@/components/password-input";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const t = useI18n();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;
  if (session) return <Navigate to="/dashboard" replace />;

  const signUp = async () => {
    await authClient.signUp.email(
      { email, password, name: "user-" + nanoid() },
      {
        onSuccess: () => navigate("/dashboard"),
        onError: (ctx: { error: { message: string } }) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <FullPageFormWrapper>
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          value={email}
          placeholder={t("signUp.emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          id="password"
          value={password}
          placeholder={t("signUp.passwordPlaceholder")}
          onChange={(value: string) => setPassword(value)}
        />
        <Button onClick={signUp} className="w-full">
          {t("signUp.signUpButton")}
        </Button>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/sign-in")}
            className="hover:bg-primary/5 w-full"
          >
            {t("signUp.signInButton")}
          </Button>
        </div>
      </div>
    </FullPageFormWrapper>
  );
}
