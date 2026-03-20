import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import type { ReactNode } from "react";

/**
 * Drop-in replacement for next-international's useI18n.
 * Returns a `t` function that accepts dot-separated keys.
 */
export function useI18n() {
  const { t } = useTranslation();
  return t;
}

/**
 * Drop-in replacement for next-international's useScopedI18n.
 * Returns a `t` function scoped to the given prefix.
 */
export function useScopedI18n(scope: string) {
  const { t } = useTranslation();
  return (key: string, params?: Record<string, unknown>) =>
    t(`${scope}.${key}`, params as Record<string, string>);
}

/**
 * Returns the current locale string (e.g. "en", "ru").
 */
export function useCurrentLocale(): string {
  const { i18n: instance } = useTranslation();
  return instance.language;
}

/**
 * Returns a function to change the locale.
 */
export function useChangeLocale() {
  return (locale: string) => {
    i18n.changeLanguage(locale);
  };
}

/**
 * No-op passthrough — i18n is initialized at module level so no provider is
 * needed. Kept for API compatibility with existing code that wraps children
 * in <I18nProviderClient>.
 */
export function I18nProviderClient({
  children,
}: {
  locale?: string;
  children: ReactNode;
}) {
  return children;
}
