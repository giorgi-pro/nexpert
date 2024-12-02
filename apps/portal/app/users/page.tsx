import { getActiveUsers } from "@repo/database/use-cases/get-active-users.use-case"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import moment from "moment"
import { DATE_FORMAT } from "@repo/ui/constants/formats"
import { withPermission } from "@repo/access/server"

async function UsersPage() {
  const users = await getActiveUsers()

  const t = await getTranslations("Users")

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
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{moment(user.createdAt).format(DATE_FORMAT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default withPermission("VIEW_ALL_USERS", UsersPage)
