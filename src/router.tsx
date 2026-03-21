import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const CreatePage = lazy(() => import("@/pages/CreatePage"));
const EditorPage = lazy(() => import("@/pages/EditorPage"));
const EditorWithIdPage = lazy(() => import("@/pages/EditorWithIdPage"));
const EditorPreviewPage = lazy(() => import("@/pages/EditorPreviewPage"));
const ExportPage = lazy(() => import("@/pages/ExportPage"));
const PresentPage = lazy(() => import("@/pages/PresentPage"));
const OfferPage = lazy(() => import("@/pages/OfferPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const SharedPage = lazy(() => import("@/pages/SharedPage"));
const TrashPage = lazy(() => import("@/pages/TrashPage"));
const TemplatesPage = lazy(() => import("@/pages/TemplatesPage"));
const ThemesPage = lazy(() => import("@/pages/ThemesPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const TeamsPage = lazy(() => import("@/pages/TeamsPage"));
const TeamDetailPage = lazy(() => import("@/pages/TeamDetailPage"));
const InvitationPage = lazy(() => import("@/pages/InvitationPage"));
const SignInPage = lazy(() => import("@/pages/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public pages
      { path: "/", element: <LazyPage><LandingPage /></LazyPage> },
      { path: "/privacy", element: <LazyPage><PrivacyPage /></LazyPage> },
      { path: "/offer", element: <LazyPage><OfferPage /></LazyPage> },

      // Auth pages (redirect if already authenticated)
      { path: "/sign-in", element: <LazyPage><SignInPage /></LazyPage> },
      { path: "/sign-up", element: <LazyPage><SignUpPage /></LazyPage> },
      { path: "/forgot-password", element: <LazyPage><ForgotPasswordPage /></LazyPage> },
      { path: "/reset-password", element: <LazyPage><ResetPasswordPage /></LazyPage> },

      // Public/shared presentation pages
      { path: "/present/:id", element: <LazyPage><PresentPage /></LazyPage> },
      { path: "/export/:id", element: <LazyPage><ExportPage /></LazyPage> },

      // Team invitation (may be unauthenticated)
      { path: "/teams/invitations/:token", element: <LazyPage><InvitationPage /></LazyPage> },

      // Protected pages with sidebar
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <SidebarLayout />,
            children: [
              { path: "/dashboard", element: <LazyPage><DashboardPage /></LazyPage> },
              { path: "/shared", element: <LazyPage><SharedPage /></LazyPage> },
              { path: "/trash", element: <LazyPage><TrashPage /></LazyPage> },
              { path: "/templates", element: <LazyPage><TemplatesPage /></LazyPage> },
              { path: "/themes", element: <LazyPage><ThemesPage /></LazyPage> },
              { path: "/settings", element: <LazyPage><SettingsPage /></LazyPage> },
              { path: "/teams", element: <LazyPage><TeamsPage /></LazyPage> },
              { path: "/teams/:id", element: <LazyPage><TeamDetailPage /></LazyPage> },
            ],
          },
          // Protected pages without sidebar
          { path: "/create", element: <LazyPage><CreatePage /></LazyPage> },
          { path: "/editor", element: <LazyPage><EditorPage /></LazyPage> },
          { path: "/editor/:id", element: <LazyPage><EditorWithIdPage /></LazyPage> },
          { path: "/editor/preview", element: <LazyPage><EditorPreviewPage /></LazyPage> },
        ],
      },
    ],
  },
]);
