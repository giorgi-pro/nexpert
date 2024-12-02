"use server"

import { getActiveUser } from "@repo/database/use-cases/get-active-user.use-case"
import { permitAction } from "@repo/access/server"
import { unstable_cache } from 'next/cache'

const getUserById = async (id: string) => {
  // Cache the user data with a tag that we can invalidate
  const getCachedUser = unstable_cache(
    async () => {
      const user = await getActiveUser({ id })
      if (!user) {
        throw new Error("userNotFound")
      }
      return user
    },
    [`user-${id}`],
    {
      tags: [`user-${id}`],
      revalidate: 60, // Cache for 60 seconds
    }
  )

  return getCachedUser()
}

export default permitAction("UPDATE_USER", getUserById)
