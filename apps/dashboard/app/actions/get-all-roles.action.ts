"use server"
import logger from "@repo/logging"
import getRoles from "@repo/database/use-cases/get-roles.use-case"
import type { I18nKey } from "/types"
import { permitAction } from "@repo/access/server"

async function getAllRoles() {
  try {
    return await getRoles().then((roles) => {
      return roles.map((role) => ({
        id: role.id,
        name: role.name as I18nKey,
      }))
    })
  } catch (error) {
    logger.error("Failed to get all roles:", error)
    throw error
  }
}

export default permitAction("MANAGE_ROLES", getAllRoles)
