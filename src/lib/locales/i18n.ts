import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import ru from "./ru";

/**
 * Flatten a nested object into dot-separated keys.
 * e.g. { a: { b: "hello" } } → { "a.b": "hello" }
 */
function flatten(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        result[`${fullKey}.${index}`] = String(item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flatten(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: flatten(en as unknown as Record<string, unknown>) },
      ru: { translation: flatten(ru as unknown as Record<string, unknown>) },
    },
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
      prefix: "{",
      suffix: "}",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
