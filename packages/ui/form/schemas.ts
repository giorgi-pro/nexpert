import { z } from "zod"

// Validation schema
export const newUserSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //   'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    // ),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    roleId: z.string().min(1, "Role is required").uuid("Invalid role ID"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type NewUserFormData = z.infer<typeof newUserSchema>

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type SignInFormData = z.infer<typeof signInSchema>

export const editUserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export type EditUserFormData = z.infer<typeof editUserSchema>
