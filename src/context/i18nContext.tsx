"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import {
  translations,
  type Language,
  type Translations,
} from "@/locales/translations";

type I18nContextProps = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
};

const storageKey = "task-list-language";
const languageChangeEvent = "task-list-language-change";
const defaultLanguage: Language = "es";

export const I18nContext = createContext<I18nContextProps>(
  {} as I18nContextProps
);

export const useTranslation = () => useContext(I18nContext);

const isLanguage = (value: string | null): value is Language => {
  return value === "es" || value === "en";
};

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const storedLanguage = window.localStorage.getItem(storageKey);

  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return defaultLanguage;
};

const getServerLanguage = (): Language => defaultLanguage;

const subscribeToLanguage = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageChangeEvent, onStoreChange);
  };
};

export const I18nProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getStoredLanguage,
    getServerLanguage
  );

  const setLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem(storageKey, nextLanguage);
    window.dispatchEvent(new Event(languageChangeEvent));
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};
