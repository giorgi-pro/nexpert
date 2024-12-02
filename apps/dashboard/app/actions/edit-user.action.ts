"use server"

import { updateUser } from "@repo/database/use-cases/update-user.use-case"
import { revalidatePath } from "next/cache"
import type { EditUserFormData } from "@repo/ui/form/schemas"

export default async function editUser(userData: EditUserFormData) {
  try {
    await updateUser({
      data: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    })

    revalidatePath("/users")
    revalidatePath(`/users/${userData.id}`)
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "genericError",
    }
  }
}
