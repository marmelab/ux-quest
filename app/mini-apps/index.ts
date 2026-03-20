import type { MiniAppDefinition } from "~/lib/types"
import { editableProfile } from "./editable-profile"
import { productTable } from "./product-table"
import { productTableBulkDelete } from "./product-table-bulk-delete"

export const miniApps: MiniAppDefinition[] = [
  editableProfile,
  productTable,
  productTableBulkDelete,
  // Add new mini-app definitions here
]
