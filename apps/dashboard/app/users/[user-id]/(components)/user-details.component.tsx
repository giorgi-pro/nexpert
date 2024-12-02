"use client"

import { useTranslations } from "next-intl"

type UserDetailsProps = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    permissions: string[]
  }
}

export default function UserDetailsComponent({ user }: UserDetailsProps) {
  const t = useTranslations("UserDetails")

  return (
    <>
      <div>
        <label className="label" htmlFor="email">
          {t("email")}
        </label>
        <p className="font-bold">{user.email}</p>
      </div>

      <div>
        <label className="label" htmlFor="fullName">
          {t("fullName")}
        </label>
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
    </>
  )
}
