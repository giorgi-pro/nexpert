"use client"

import { toast } from "react-hot-toast"
import { useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { withPermission } from "@repo/access/client"
import getUserById from "~/actions/get-user-by-id.action"
import type { I18nKey } from "/types"
import useSingleEffect from "@repo/ui/hooks/use-single-effect.hook"
import PageLoadingComponent from "@repo/ui/components/page-loading.component"
import NotFound404 from "@repo/ui/components/404.component"
import EditUserComponent from "./(components)/edit-user.component"
import UserDetailsComponent from "./(components)/user-details.component"
import LoadingButtonComponent from "@repo/ui/components/action-button.component"
import EditIcon from "@repo/ui/icons/edit.icon"
import Link from "next/link"
import { useServerAction } from "@repo/ui/hooks/use-server-action"

type UserPageProps = {
  params: Promise<{
    "user-id": string
  }>
}

function UserPage({ params }: UserPageProps) {
  const t = useTranslations("UserDetails")
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get("edit") === "true"
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUserById>> | null>(null)
  const userId = use(params)["user-id"]
  const { callAction: getUser, isPending: getUserPending, error: getUserError } = useServerAction(getUserById, {
    onSuccess: (user) => {
      setUser(user)
    },
  })

  useSingleEffect(
    async () => {
      try {
        await getUser(userId)
      } catch (error) {
        toast.error(t((error instanceof Error ? error.message : "errorLoading") as I18nKey))
        router.push("/users")
      } 
    },
    [],
    [],
  )

  if (getUserPending) {
    return <PageLoadingComponent />
  }

  if (!user) return <NotFound404 />

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        {!isEditMode && (
          <Link href={`/users/${user.id}?edit=true`}>
            <LoadingButtonComponent className="btn-warning" isLoading={false}>
              <EditIcon />
          </LoadingButtonComponent>
        </Link>)}
      </div>

      <div className="bg-base-100l">
        <div className="flex flex-col gap-5">
          <div>
            <label className="label" htmlFor="id">
              {t("id")}
            </label>
            <p className="text-secondary font-bold">{user.id}</p>
          </div>
          {isEditMode ? (
            <EditUserComponent
              user={user}
              onSubmit={() => router.push(`/users/${user.id}`)}
            />
          ) : (
            <UserDetailsComponent user={user} />
          )}

          <div>
            <label className="label" htmlFor="role">
              {t("role")}
            </label>
            <p className="uppercase text-secondary font-bold">{t(user.role as I18nKey)}</p>
          </div>

          <div>
            <label className="label" htmlFor="permissions">
              {t("permissions")}
            </label>
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((permission) => (
                <span key={permission} className="badge badge-primary">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => getUser(userId).then(() => router.push("/users"))}
          className="btn btn-ghost"
        >
          {t("back")}
        </button>
      </div>
    </div>
  )
}

export default withPermission(["VIEW_ALL_USERS", "UPDATE_USER"], UserPage)
