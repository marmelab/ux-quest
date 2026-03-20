import type { MiniAppDefinition } from "~/lib/types"
import { editableProfile } from "./editable-profile"
import { contactTableEdit } from "./contact-table-edit"
import { monitoringDashboard } from "./monitoring-dashboard"
import { productFormCollapsible } from "./product-form-collapsible"
import { productTable } from "./product-table"
import { productTableBulkDelete } from "./product-table-bulk-delete"
import { shirtCatalogFilter } from "./shirt-catalog-filter"

export const miniApps: MiniAppDefinition[] = [
  editableProfile,
  productTable,
  productTableBulkDelete,
  productFormCollapsible,
  monitoringDashboard,
  contactTableEdit,
  shirtCatalogFilter,
  // Add new mini-app definitions here
]
