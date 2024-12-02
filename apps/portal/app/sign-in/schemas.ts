import { z } from "zod"
import { getPublicConfig } from "@repo/config"

export const signInCodeSchema = z.object({
  code: z.string().length(getPublicConfig().app.authCodeLength),
})
