"use server"
import logger from "@repo/logging"
import { permitAction } from "@repo/access/server"
import { getActiveUsers } from "@repo/database/use-cases/get-active-users.use-case"

async function getActiveUsersAction() {
  try {
    return getActiveUsers()
  } catch (error) {
    logger.error("Failed to get all users:", error)
    throw error
  }
}

export default permitAction("VIEW_ALL_USERS", getActiveUsersAction)
