"use client";

import { Globe } from "@gravity-ui/icons";
import { useRef, useState } from "react";
import { useTranslation } from "@/context/i18nContext";
import type { Language } from "@/locales/translations";

const languages: Array<{
  code: Language;
  shortLabel: string;
}> = [
  {
    code: "es",
    shortLabel: "ES",
  },
  {
    code: "en",
    shortLabel: "EN",
  },
];

export const LanguageSwitch = () => {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedLanguage = languages.find((item) => item.code === language) ?? languages[0];

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setIsOpen(false);
  };

  return (
    <div className="language-switch" ref={menuRef}>
      <button
        className="language-switch-trigger"
        type="button"
        aria-label={t.common.chooseLanguage}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        <Globe aria-hidden="true" />
        <span>{selectedLanguage.shortLabel}</span>
      </button>

      {isOpen && (
        <div className="language-menu" role="menu" aria-label={t.common.chooseLanguage}>
          <span className="language-menu-title">{t.common.chooseLanguage}</span>
          {languages.map((item) => (
            <button
              className="language-menu-item"
              type="button"
              key={item.code}
              role="menuitemradio"
              aria-checked={item.code === language}
              onClick={() => changeLanguage(item.code)}
            >
              <span className="language-menu-check" aria-hidden="true">
                {item.code === language ? "✓" : ""}
              </span>
              <span>
                {item.code === "es" && t.common.spanish}
                {item.code === "en" && t.common.english}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
