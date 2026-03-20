import type { MiniAppDefinition } from "~/lib/types"
import { fontMismatchCard } from "./font-mismatch-card"
import { productTable } from "./product-table"

export const miniApps: MiniAppDefinition[] = [
  fontMismatchCard,
  productTable,
  // Add new mini-app definitions here
]
