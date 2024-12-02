import type { PagingOptions } from "../types"
import { PagingOptionsSchema } from "../validation/schemas"

export default function extractLimit(options: PagingOptions) {
  const { pageIndex, pageSize } = PagingOptionsSchema.parse(options);
  return {
    offset: pageIndex * pageSize,
    limit: pageSize,
  };
}
