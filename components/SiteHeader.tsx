"use client";

import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import { sharedCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const copy = sharedCopy[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageChange = (nextLanguage: "es" | "en") => {
    setLanguage(nextLanguage);
    setIsMenuOpen(false);
  };

  return (
    <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="shell-frame flex flex-col gap-4 rounded-2xl px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex size-12 items-center shrink-0 justify-center rounded-xl border border-[#00d992]/50 bg-surface-soft shadow-panel">
              <div className="size-5 rounded-full bg-accent animate-signal-pulse" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-xl font-medium tracking-[-0.03em] text-foreground">
                {copy.appName}
              </p>
              <p className="text-xs leading-5 text-muted sm:text-sm sm:leading-6 sm:truncate">
                {copy.appTagline}
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Open language menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-black/20 text-foreground transition-colors hover:border-accent/40 sm:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        <div className="hidden items-center sm:flex">
          <div className="flex overflow-hidden rounded-md border border-border bg-black/20">
            <button
              type="button"
              onClick={() => handleLanguageChange("es")}
              className={cn(
                "px-3 py-2 text-xs font-semibold transition-colors",
                language === "es"
                  ? "bg-surface text-accent-soft"
                  : "text-muted hover:text-foreground",
              )}
            >
              {copy.spanish}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={cn(
                "border-l border-border px-3 py-2 text-xs font-semibold transition-colors",
                language === "en"
                  ? "bg-surface text-accent-soft"
                  : "text-muted hover:text-foreground",
              )}
            >
              {copy.english}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="sm:hidden">
            <div className="flex overflow-hidden rounded-md border border-border bg-black/20">
              <button
                type="button"
                onClick={() => handleLanguageChange("es")}
                className={cn(
                  "flex-1 px-3 py-2 text-xs font-semibold transition-colors",
                  language === "es"
                    ? "bg-surface text-accent-soft"
                    : "text-muted hover:text-foreground",
                )}
              >
                {copy.spanish}
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={cn(
                  "flex-1 border-l border-border px-3 py-2 text-xs font-semibold transition-colors",
                  language === "en"
                    ? "bg-surface text-accent-soft"
                    : "text-muted hover:text-foreground",
                )}
              >
                {copy.english}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
