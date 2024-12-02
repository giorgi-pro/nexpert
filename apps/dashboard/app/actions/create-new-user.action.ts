"use server"

import logger from "@repo/logging"
import { newUserSchema, type NewUserFormData } from "@repo/ui/form/schemas"

import { saveNewUser } from "@repo/database/use-cases/save-new-user.use-case"
import { permitAction } from "@repo/access/server"

async function createNewUser(input: NewUserFormData) {
  try {
    const newUser = newUserSchema.parse(input)

    logger.info("Creating new user", { newUser })

    const savedUser = await saveNewUser({
      data: { ...newUser },
    })
    return savedUser
  } catch (error) {
    console.error("Failed to create new user:", error)
    return {
      success: false,
      error: "Failed to create user",
    }
  }
}

export default permitAction("CREATE_USER", createNewUser)
