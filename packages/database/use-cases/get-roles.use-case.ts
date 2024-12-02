import { getDatabase } from "@repo/database"
import { roles } from "@repo/database/schema"

type GetRolesResult = Pick<typeof roles.$inferSelect, "name" | "id">[]

export default async function getRoles(): Promise<GetRolesResult> {
  const db = await getDatabase()

  const result = await db
    .select({
      id: roles.id,
      name: roles.name,
    })
    .from(roles)

  return result
}
