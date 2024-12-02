import { getRequestConfig } from "next-intl/server"
import { en, fr } from "@repo/i18n"

const MESSAGES = {
  en,
  fr,
}

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = "en"

  return {
    locale,
    messages: MESSAGES[locale],
  }
})
