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
import { loginFormLumen } from "./login-form-lumen"
import { loginFormPulse } from "./login-form-pulse"
import { breadcrumbNav } from "./help-center-admin"
import { meetupEvent } from "./meetup-event"
import { notificationSettings } from "./notification-settings"

export const miniApps: MiniAppDefinition[] = [
  bookstoreAdmin,
  breadcrumbNav,
  contactSheet,
  contactTableEdit,
  editableProfile,
  loginForm,
  loginFormLumen,
  loginFormPulse,
  meetupEvent,
  monitoringDashboard,
  notificationSettings,
  productCatalogDetail,
  productFormCollapsible,
  productTable,
  productTableBulkDelete,
  salesChart,
  shirtCatalog,
  // Add new mini-app definitions here
]
