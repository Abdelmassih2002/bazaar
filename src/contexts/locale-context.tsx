"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Locale, type TranslationKey } from "@/lib/i18n"

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
  dir: "ltr" | "rtl"
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved === "en" || saved === "ar") setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem("locale", l)
    document.documentElement.lang = l
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr"
  }

  const t = (key: TranslationKey) => translations[locale][key] ?? key
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
