import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionDialog } from "@/components/subscription-dialog";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Providers } from "@/components/providers";

export function RootLayout() {
  return (
    <Providers>
      <Outlet />
      <SubscriptionDialog />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </Providers>
  );
}
