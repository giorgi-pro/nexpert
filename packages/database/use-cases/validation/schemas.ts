import { z } from "zod"

export const PagingOptionsSchema = z.object({
    pageIndex: z.number().int().gte(0),
    pageSize: z.number().int().gte(0),
  })
