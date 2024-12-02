import type { PagingOptionsSchema } from "../validation/schemas";
import type { z } from "zod";

export type PagingOptions = z.infer<typeof PagingOptionsSchema>;
