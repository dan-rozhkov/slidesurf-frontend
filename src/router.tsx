import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import CreatePage from "@/pages/CreatePage";
import EditorPage from "@/pages/EditorPage";
import EditorWithIdPage from "@/pages/EditorWithIdPage";
import EditorPreviewPage from "@/pages/EditorPreviewPage";
import ExportPage from "@/pages/ExportPage";
import PresentPage from "@/pages/PresentPage";
import PricingPage from "@/pages/PricingPage";
import OfferPage from "@/pages/OfferPage";
import PrivacyPage from "@/pages/PrivacyPage";
import SharedPage from "@/pages/SharedPage";
import TrashPage from "@/pages/TrashPage";
import TemplatesPage from "@/pages/TemplatesPage";
import ThemesPage from "@/pages/ThemesPage";
import SettingsPage from "@/pages/SettingsPage";
import TeamsPage from "@/pages/TeamsPage";
import TeamDetailPage from "@/pages/TeamDetailPage";
import InvitationPage from "@/pages/InvitationPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public pages
      { path: "/", element: <LandingPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/offer", element: <OfferPage /> },

      // Auth pages (redirect if already authenticated)
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },

      // Public/shared presentation pages
      { path: "/present/:id", element: <PresentPage /> },
      { path: "/export/:id", element: <ExportPage /> },

      // Team invitation (may be unauthenticated)
      { path: "/teams/invitations/:token", element: <InvitationPage /> },

      // Protected pages with sidebar
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <SidebarLayout />,
            children: [
              { path: "/dashboard", element: <DashboardPage /> },
              { path: "/shared", element: <SharedPage /> },
              { path: "/trash", element: <TrashPage /> },
              { path: "/templates", element: <TemplatesPage /> },
              { path: "/themes", element: <ThemesPage /> },
              { path: "/settings", element: <SettingsPage /> },
              { path: "/teams", element: <TeamsPage /> },
              { path: "/teams/:id", element: <TeamDetailPage /> },
            ],
          },
          // Protected pages without sidebar
          { path: "/create", element: <CreatePage /> },
          { path: "/editor", element: <EditorPage /> },
          { path: "/editor/:id", element: <EditorWithIdPage /> },
          { path: "/editor/preview", element: <EditorPreviewPage /> },
        ],
      },
    ],
  },
]);
