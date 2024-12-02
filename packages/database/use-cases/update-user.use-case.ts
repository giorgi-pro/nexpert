import { getDatabase } from "@repo/database"
import { users } from "@repo/database/schema"
import { eq } from "drizzle-orm"

import { z } from "zod"

const updateUserOptionsSchema = z.object({
  data: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  }),
})

type UpdateUserOptions = z.infer<typeof updateUserOptionsSchema>

export const updateUser = async (options: UpdateUserOptions) => {
  const db = await getDatabase()
  const [updatedUser] = await db
    .update(users)
    .set({
      email: options.data.email,
      firstName: options.data.firstName,
      lastName: options.data.lastName,
    })
    .where(eq(users.id, options.data.id))
    .returning()

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
  }
}
