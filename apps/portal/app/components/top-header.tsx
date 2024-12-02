"use client"

import { useTranslations } from "next-intl"
// import { authOptions } from "src/app/api/auth/[...nextauth]/route";

import type { TFunction, User } from "/types"
import ProfileMenuEntryComponent from "./profile-menu-entry.component"
import { useSession } from "next-auth/react"

const getSections = (t: TFunction, user?: User) => [
  ...(user
    ? []
    : [
        {
          title: t("signIn"),
          href: "/sign-in",
        },
      ]),
]

export default function TopHeader() {
  const t = useTranslations("SignIn")
  // const session = await getServerSession(authOptions);
  const { data: session } = useSession()

  return (
    <div className="flex flex-row justify-end gap-2 p-4">
      {getSections(t, session?.user).map((section) => (
        <div key={section.title}>
          <a href={section.href} className="w-full py-1 text-xs uppercase">
            {section.title}
          </a>
        </div>
      ))}
      {session?.user && (
        <ProfileMenuEntryComponent email={session.user.email} key={session.user.email} />
      )}
    </div>
  )
}
