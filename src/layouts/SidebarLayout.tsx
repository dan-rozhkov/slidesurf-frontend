import { Outlet, useLocation } from "react-router-dom";
import { MainNavSidebar } from "@/components/main-nav-sidebar";

export function SidebarLayout() {
  const { pathname } = useLocation();

  return (
    <div className="grid grid-cols-[300px_1fr]">
      <aside className="bg-background">
        <MainNavSidebar />
      </aside>
      <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
        <Outlet key={pathname} />
      </main>
    </div>
  );
}
