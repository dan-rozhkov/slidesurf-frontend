import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader, Moon, Plus, Sun } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ApiKeysList from "@/components/settings/api-keys-list";
import { useTheme } from "next-themes";
import {
  useScopedI18n,
  useCurrentLocale,
  useChangeLocale,
} from "@/lib/locales/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateApiKeyForm from "@/components/settings/create-api-key-form";
import SubscriptionStatus from "@/components/settings/subscription-status";
import { UserAvatar } from "@/components/user-avatar";

const formSchema = z.object({
  name: z.string().min(1),
});

type Inputs = z.infer<typeof formSchema>;

function UserInfoSkeleton() {
  return (
    <div className="pt-6">
      <div className="size-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex shrink-0 animate-pulse" />
      <div className="flex flex-col gap-2 pt-6">
        <div className="h-8 w-60 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex shrink-0 animate-pulse" />
        <div className="h-4 w-40 rounded-md bg-neutral-100 dark:bg-neutral-800 flex shrink-0 animate-pulse" />
      </div>
    </div>
  );
}

export default function SettingsPageClient() {
  const t = useScopedI18n("settings");
  const [openCreateApiKeyDialog, setOpenCreateApiKeyDialog] = useState(false);
  const [openCopyApiKeyDialog, setOpenCopyApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const { data: session, isPending } = authClient.useSession();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  });
  const { theme, setTheme } = useTheme();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  useEffect(() => {
    if (session?.user?.name) {
      setValue("name", session.user.name);
    }
  }, [session?.user?.name, setValue]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["account", "subscription", "api-keys"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleFormSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      await authClient.updateUser({ name: data.name });
      toast.success(t("nameMessages.success"));
    } catch (error) {
      console.error(error);
      toast.error(t("nameMessages.error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <UserInfoSkeleton />;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="account">{t("account")}</TabsTrigger>
        <TabsTrigger value="subscription">{t("subscription")}</TabsTrigger>
        <TabsTrigger value="api-keys">{t("apiKeys")}</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full max-w-2xl"
        >
          <div className="pt-6">
            <UserAvatar
              name={session?.user?.name}
              email={session?.user?.email}
              size="xl"
            />
            <h2 className="text-2xl font-bold tracking-tight pt-4">
              {session?.user?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col gap-4 items-end">
            <div className="space-y-1 w-full">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" {...register("name")} />
            </div>

            <div className="space-y-1 w-full">
              <Label>{t("language")}</Label>
              <Select
                value={currentLocale}
                onValueChange={(value) => changeLocale(value as "en" | "ru")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 w-full">
              <Label>{t("theme")}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="size-4" strokeWidth={1.5} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Moon className="size-4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader className="size-4 animate-spin" strokeWidth={1.5} />
              )}
              {t("save")}
            </Button>
          </div>
        </form>
      </TabsContent>
      <TabsContent value="api-keys">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-bold tracking-tight pt-4">
              {t("apiKeys")}
            </h2>
            <Dialog
              open={openCreateApiKeyDialog}
              onOpenChange={setOpenCreateApiKeyDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                  {t("create")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createApiKey")}</DialogTitle>
                </DialogHeader>
                <CreateApiKeyForm
                  onSuccess={(key) => {
                    setApiKey(key);
                    setOpenCreateApiKeyDialog(false);
                    setOpenCopyApiKeyDialog(true);
                  }}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openCopyApiKeyDialog}
              onOpenChange={setOpenCopyApiKeyDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("copyApiKey")}</DialogTitle>
                  <DialogDescription>
                    {t("copyApiKeyDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 items-end">
                  <Input value={apiKey} />
                  <Button
                    onClick={() => {
                      navigator?.clipboard?.writeText(apiKey);
                      toast.success(t("copyApiKeySuccess"));
                    }}
                  >
                    <Copy className="size-4" />
                    {t("copy")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ApiKeysList />
        </div>
      </TabsContent>
      <TabsContent value="subscription">
        <SubscriptionStatus
          initialPromoCode={searchParams.get("promoCode") || undefined}
        />
      </TabsContent>
    </Tabs>
  );
}
