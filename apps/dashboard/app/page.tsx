"use client"

import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"

export default function HomePage() {
  const t = useTranslations("HomePage")
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-8">{JSON.stringify(session?.user?.permissions)}</div>
  )
}
