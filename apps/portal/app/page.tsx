import { useTranslations } from "next-intl"

export default function HomePage() {
  const t = useTranslations("HomePage")

  return <div className="container mx-auto px-4 py-8">{t("title")}</div>
}
