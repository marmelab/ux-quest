import type { MiniAppDefinition } from "~/lib/types"
import { editableProfile } from "./editable-profile"
import { productTable } from "./product-table"

export const miniApps: MiniAppDefinition[] = [
  editableProfile,
  productTable,
  // Add new mini-app definitions here
]
