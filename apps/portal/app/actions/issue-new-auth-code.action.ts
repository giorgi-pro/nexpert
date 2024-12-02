"use server"

import type { SignInFormData } from "@repo/ui/form/schemas"

import createNewSession from "@repo/database/use-cases/create-new-session.use-case"
import { getActiveUser } from "@repo/database/use-cases/get-active-user.use-case"
import sendSignInLink from "@repo/mailing/send-sign-in-link"
import logger from "@repo/logging"

export async function issueNewAuthCodeAction(input: SignInFormData) {
  try {
    const user = await getActiveUser({ email: input.email })
    const session = await createNewSession({
      userId: user.id,
    })
    await sendSignInLink(user.email, session.code)
  } catch (error) {
    logger.error("Failed to issue new auth code:", error)
    throw error
  }
}
