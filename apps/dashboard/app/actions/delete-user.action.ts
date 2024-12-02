"use server"

import logger from "@repo/logging"
import { permitAction } from "@repo/access/server"
import deleteUserUseCase from "@repo/database/use-cases/delete-user.use-case"

async function deleteUser(id: string) {
  try {
    return deleteUserUseCase({ id })
  } catch (error) {
    logger.error("Failed to delete user:", error)
    throw error
  }
}

export default permitAction("DELETE_USER", deleteUser)
