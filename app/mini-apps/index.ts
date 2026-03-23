import type { MiniAppDefinition } from "~/lib/types"
import { editableProfile } from "./editable-profile"
import { contactTableEdit } from "./contact-table-edit"
import { monitoringDashboard } from "./monitoring-dashboard"
import { productFormCollapsible } from "./product-form-collapsible"
import { productTable } from "./product-table"
import { productTableBulkDelete } from "./product-table-bulk-delete"
import { shirtCatalog } from "./shirt-catalog"
import { loginForm } from "./login-form"
import { bookstoreAdmin } from "./bookstore-admin"
import { salesChart } from "./sales-chart"
import { contactSheet } from "./contact-sheet"
import { productCatalogDetail } from "./product-catalog-detail"
import { loginFormPulse } from "./login-form-pulse"
import { breadcrumbNav } from "./help-center-admin"

export const miniApps: MiniAppDefinition[] = [
  editableProfile,
  productTable,
  productTableBulkDelete,
  productFormCollapsible,
  monitoringDashboard,
  contactTableEdit,
  shirtCatalog,
  loginForm,
  bookstoreAdmin,
  salesChart,
  contactSheet,
  productCatalogDetail,
  loginFormPulse,
  breadcrumbNav,
  // Add new mini-app definitions here
]
