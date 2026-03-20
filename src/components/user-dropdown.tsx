
import { authClient } from "@/lib/auth-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScopedI18n } from "@/lib/locales/client";
import { revalidate } from "@/api/subscription";
import { useUserSubscription } from "@/lib/hooks/use-user-subscription";
import { UserAvatar } from "@/components/user-avatar";
import { isSubscriptionEnabled } from "@/lib/subscription-utils";

function UserDropdownSkeleton() {
  return (
    <div className="flex items-center gap-2 cursor-pointer p-2 -mx-2">
      <div className="size-10 rounded-full bg-neutral-200 animate-pulse" />
      <div className="flex flex-col gap-1 items-start">
        <div className="w-32 h-4 rounded-full bg-neutral-200 animate-pulse" />
        <div className="w-24 h-3 rounded-full bg-neutral-200 animate-pulse" />
      </div>
    </div>
  );
}

export function UserDropdown() {
  const { data: session, isPending, error } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const t = useScopedI18n("userDropdown");

  const { data: subscription } = useUserSubscription({
    enabled: !!session?.user,
  });

  const handleLogout = useCallback(() => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/sign-in");
          revalidate("/dashboard");
        },
      },
    });
  }, [navigate]);

  if (isPending) {
    return <UserDropdownSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg p-2 -mx-2">
          <UserAvatar
            name={session?.user?.name}
            email={session?.user?.email}
            size="md"
          />
          <div className="flex flex-col gap-1 items-start overflow-hidden grow">
            <span className="text-sm font-bold truncate w-full">
              {session?.user?.name || session?.user?.email}
            </span>
            {isSubscriptionEnabled() && subscription && (
              <span className="text-xs text-neutral-500 inline-flex py-0.5 px-2 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 rounded-sm">
                {subscription.planType === "free"
                  ? t("subscription.free")
                  : subscription.planType === "plus"
                  ? t("subscription.plus")
                  : subscription.planType === "pro"
                  ? t("subscription.pro")
                  : subscription.planType}
              </span>
            )}
          </div>
          <ChevronDown className="size-4 shrink-0" strokeWidth={1.5} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-1" sideOffset={5}>
        <div
          className="cursor-pointer flex items-center text-sm gap-3 [&_svg]:size-4 [&_svg]:shrink-0 gap-4 px-3 py-2.5 rounded-lg hover:bg-accent text-accent-foreground"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
            navigate("/settings");
          }}
        >
          <User className="size-4" strokeWidth={1.5} />
          <span>{t("profile")}</span>
        </div>

        <div
          className="cursor-pointer flex items-center text-sm gap-3 [&_svg]:size-4 [&_svg]:shrink-0 gap-4 px-3 py-2.5 rounded-lg hover:bg-accent text-accent-foreground"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogout();
            setOpen(false);
          }}
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          <span>{t("logout")}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
