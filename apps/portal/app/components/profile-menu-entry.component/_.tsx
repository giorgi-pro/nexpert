"use client"

import type React from "react"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { ProfileIcon } from "@repo/ui/icons"
import { toast } from "react-hot-toast"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { delay, clsx } from "@repo/ui/helpers"
import LoadingButtonComponent from "@repo/ui/components/action-button.component"

interface ProfileMenuEntryProps {
  email: string
}

const ProfileMenuEntryComponent: React.FC<ProfileMenuEntryProps> = ({ email }) => {
  const t = useTranslations("Profile")
  const [inProgress, setInProgress] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [leaveOpen, setLeaveOpen] = useState(false)

  const handleSignOut = async () => {
    setLeaveOpen(true)
    setInProgress(true)
    await delay(500)
    await signOut({
      redirect: false,
    })
    toast.success(t("signedOut"))
    setInProgress(false)
    setLeaveOpen(false)
    if (pathname !== "/") {
      router.push("/")
    }
  }

  return (
    <div className={clsx("dropdown dropdown-end", leaveOpen ? "dropdown-open" : "")}>
      <button tabIndex={0} type="button" className="btn m-1">
        <ProfileIcon />
      </button>
      <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow flex flex-col gap-2 ">
        <li>
          <button type="button" className="btn btn-sm">
            {email}
          </button>
        </li>
        <li>
          <LoadingButtonComponent
            className="btn btn-sm btn-warning"
            isLoading={inProgress}
            onClick={handleSignOut}
          >
            {t("signOut")}
          </LoadingButtonComponent>
        </li>
      </ul>
    </div>
  )
}

export default ProfileMenuEntryComponent
