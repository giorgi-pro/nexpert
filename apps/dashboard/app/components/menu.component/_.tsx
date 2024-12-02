// import { authOptions } from "src/app/api/auth/[...nextauth]/route";
// import { hasClearance } from "src/lib/auth.lib/server";
import { clsx } from "@repo/ui/helpers"
import Lynk from "@repo/ui/components/lynk.component"
import type { I18nKey, TFunction } from "/types"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { PERMISSIONS, type Permission } from "@repo/access/constants"

const getSections: (t: TFunction) => {
  title: I18nKey
  href: string
  permission?: Permission
}[] = (t: TFunction) => [
  {
    title: t("home"),
    href: "/",
  },
  {
    title: t("users"),
    href: "/users",
    permission: "VIEW_ALL_USERS",
  },
]

export default function Menu() {
  const t = useTranslations("Menu")
  const session = useSession()

  return (
    <div className="flex flex-col items-stretch gap-4 p-12 pt-32">
      {getSections(t)
        .filter(
          (section) =>
            !section.permission ||
            session.data?.user?.permissions.includes(PERMISSIONS[section.permission]),
        )
        .map((section) => (
          <div key={section.title}>
            <Lynk
              to={section.href}
              className={clsx(
                "w-full px-2 py-1 font-bold uppercase hover:text-white",
                "hover:bg-black",
              )}
              activeClassName="bg-black text-white"
            >
              {section.title}
            </Lynk>
          </div>
        ))}
    </div>
  )
}
