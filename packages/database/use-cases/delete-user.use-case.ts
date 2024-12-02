import { getDatabase } from "@repo/database"
import { sessions, users } from "@repo/database/schema"
import { eq } from "drizzle-orm"

type DeleteUserOptions = {
  id: string
}

export const deleteUserUseCase = async (options: DeleteUserOptions) => {
  const db = await getDatabase()
  const { id } = options

  db.transaction(async (tx) => {
    await tx.delete(sessions).where(eq(sessions.userId, id))
    await tx.delete(users).where(eq(users.id, id))
  })
}

export default deleteUserUseCase
