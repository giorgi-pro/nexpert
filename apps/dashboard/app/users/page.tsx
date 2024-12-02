"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import moment from "moment"
import { DATE_FORMAT } from "@repo/ui/constants/formats"
import { withPermission } from "@repo/access/client"
import { EditIcon, TrashIcon } from "@repo/ui/icons"
import LoadingButtonComponent from "@repo/ui/components/action-button.component"
import DialogComponent from "@repo/ui/components/dialog.component"
import { useRef, useState } from "react"
import { useServerAction } from "@repo/ui/hooks/use-server-action"
import useSingleEffect from "@repo/ui/hooks/use-single-effect.hook"
import getActiveUsers from "~/actions/get-active-users.action"
import deleteUserAction from "~/actions/delete-user.action"
import toast from "react-hot-toast"

function UsersPage() {
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getActiveUsers>>>([])
  const selectedUser = useRef<string | null>(null)

  const { callAction: callGetActiveUsers } = useServerAction(getActiveUsers, {
    onSuccess(data) {
      setUsers(data)
    },
  })

  const { callAction: callDeleteUser, isPending: isDeletingUser } = useServerAction(
    deleteUserAction,
    {
      onSuccess() {
        toast.success(t("successDeleting"))
        setShowDialog(false)
      },
    },
  )

  useSingleEffect(
    () => {
      callGetActiveUsers()
    },
    [],
    [],
  )

  const t = useTranslations("Users")

  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/users/new" className="btn btn-primary">
          {t("createUser")}
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>{t("id")}</th>
              <th>{t("fullName")}</th>
              <th>{t("email")}</th>
              <th>{t("createdAt")}</th>
              <th className="text-right">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link
                    href={`/users/${user.id}`}
                    className="text-secondary font-bold hover:underline"
                  >
                    {user.id}
                  </Link>
                </td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{moment(user.createdAt).format(DATE_FORMAT)}</td>
                <td>
                  <div className="flex gap-2 justify-end">
                    <Link href={`/users/${user.id}?edit=true`}> {/* editUrl('users', 'id')*/}
                      <LoadingButtonComponent className="btn-warning" isLoading={false}>
                        <EditIcon />
                      </LoadingButtonComponent>
                    </Link>
                    <LoadingButtonComponent
                      className="btn-error"
                      onClick={() => {
                        selectedUser.current = user.id
                        setShowDialog(true)
                      }}
                      isLoading={isDeletingUser}
                    >
                      <TrashIcon />
                    </LoadingButtonComponent>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DialogComponent
        title="Are you sure you want to delete this user?"
        content="This action cannot be undone."
        show={showDialog}
        onConfirm={() => {
          if (selectedUser.current) {
            callDeleteUser(selectedUser.current)
          }
        }}
        onCancel={() => setShowDialog(false)}
      />
    </div>
  )
}

export default withPermission(["VIEW_ALL_USERS"], UsersPage)
