import { useState } from "react"
import type { MiniAppDefinition } from "~/lib/types"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

interface ProductFormData {
  name: string
  sku: string
  price: string
  compareAtPrice: string
  category: string
  description: string
  weight: string
  length: string
  width: string
  height: string
  metaTitle: string
  metaDescription: string
  slug: string
}

const initialData: ProductFormData = {
  name: "Wireless Bluetooth Headphones",
  sku: "WBH-2024-001",
  price: "79.99",
  compareAtPrice: "99.99",
  category: "electronics",
  description:
    "Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
  weight: "0.35",
  length: "20",
  width: "18",
  height: "8",
  metaTitle: "Wireless Bluetooth Headphones – Premium ANC",
  metaDescription:
    "Shop premium wireless Bluetooth headphones with ANC and 30h battery.",
  slug: "wireless-bluetooth-headphones",
}

type SectionKey = "basic" | "pricing" | "shipping" | "seo"

interface FormFieldError {
  field: keyof ProductFormData
  message: string
}

const CATEGORIES = [
  { value: "", label: "Select a category…" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "books", label: "Books" },
]

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/50"
      >
        {title}
        <svg
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="border-t border-border px-4 pt-3 pb-4">{children}</div>
      )}
    </div>
  )
}

const selectClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"

function ProductFormCollapsible() {
  const [data, setData] = useState<ProductFormData>(initialData)
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      basic: true,
      pricing: false,
      shipping: false,
      seo: false,
    }
  )
  const [errors, setErrors] = useState<FormFieldError[]>([])
  const [submitted, setSubmitted] = useState(false)

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function update(field: keyof ProductFormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
    if (submitted) {
      setErrors((prev) => prev.filter((e) => e.field !== field))
    }
  }

  function errorFor(field: keyof ProductFormData) {
    return errors.find((e) => e.field === field)?.message
  }

  function validate(): FormFieldError[] {
    const errs: FormFieldError[] = []

    // Basic info
    if (!data.name.trim())
      errs.push({ field: "name", message: "Product name is required" })
    if (!data.sku.trim())
      errs.push({ field: "sku", message: "SKU is required" })
    if (data.sku.trim() && !/^[A-Z0-9-]+$/.test(data.sku.trim()))
      errs.push({
        field: "sku",
        message: "SKU must contain only uppercase letters, numbers, and dashes",
      })
    if (!data.category)
      errs.push({ field: "category", message: "Category is required" })
    if (!data.description.trim())
      errs.push({ field: "description", message: "Description is required" })
    if (
      data.description.trim().length > 0 &&
      data.description.trim().length < 20
    )
      errs.push({
        field: "description",
        message: "Description must be at least 20 characters",
      })

    // Pricing
    if (!data.price.trim())
      errs.push({ field: "price", message: "Price is required" })
    if (
      data.price.trim() &&
      (isNaN(Number(data.price)) || Number(data.price) <= 0)
    )
      errs.push({ field: "price", message: "Price must be a positive number" })
    if (
      data.compareAtPrice.trim() &&
      (isNaN(Number(data.compareAtPrice)) || Number(data.compareAtPrice) <= 0)
    )
      errs.push({
        field: "compareAtPrice",
        message: "Compare-at price must be a positive number",
      })
    if (
      data.price.trim() &&
      data.compareAtPrice.trim() &&
      Number(data.compareAtPrice) <= Number(data.price)
    )
      errs.push({
        field: "compareAtPrice",
        message: "Compare-at price must be higher than the price",
      })

    // Shipping
    if (!data.weight.trim())
      errs.push({ field: "weight", message: "Weight is required" })
    if (
      data.weight.trim() &&
      (isNaN(Number(data.weight)) || Number(data.weight) <= 0)
    )
      errs.push({
        field: "weight",
        message: "Weight must be a positive number",
      })
    for (const dim of ["length", "width", "height"] as const) {
      if (
        data[dim].trim() &&
        (isNaN(Number(data[dim])) || Number(data[dim]) <= 0)
      )
        errs.push({
          field: dim,
          message: `${dim.charAt(0).toUpperCase() + dim.slice(1)} must be a positive number`,
        })
    }

    // SEO
    if (data.metaTitle.trim().length > 60)
      errs.push({
        field: "metaTitle",
        message: "Meta title must be 60 characters or fewer",
      })
    if (data.metaDescription.trim().length > 160)
      errs.push({
        field: "metaDescription",
        message: "Meta description must be 160 characters or fewer",
      })
    if (!data.slug.trim())
      errs.push({ field: "slug", message: "URL slug is required" })
    if (
      data.slug.trim() &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())
    )
      errs.push({
        field: "slug",
        message: "Slug must be lowercase letters, numbers, and dashes only",
      })

    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setSubmitted(true)

    // BUG: We do NOT auto-expand sections that contain errors.
    // If a collapsed section has a validation error, the user
    // won't see it — the section stays collapsed with no visible indication.

    if (errs.length === 0) {
      alert("Product saved successfully!")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-lg flex-col gap-3 p-4 text-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Edit Product</h2>
        <Button type="submit" size="sm">
          Save Product
        </Button>
      </div>

      {submitted && errors.length > 0 && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Please fix {errors.length} error{errors.length > 1 ? "s" : ""} before
          saving.
        </div>
      )}

      {/* Basic Information */}
      <CollapsibleSection
        title="Basic Information"
        open={openSections.basic}
        onToggle={() => toggleSection("basic")}
      >
        <FieldGroup>
          <Field data-invalid={!!errorFor("name") || undefined}>
            <FieldTitle>
              Product Name <span className="text-destructive">*</span>
            </FieldTitle>
            <Input
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errorFor("name") || undefined}
            />
            <FieldError>{errorFor("name")}</FieldError>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field data-invalid={!!errorFor("sku") || undefined}>
              <FieldTitle>
                SKU <span className="text-destructive">*</span>
              </FieldTitle>
              <Input
                value={data.sku}
                onChange={(e) => update("sku", e.target.value)}
                aria-invalid={!!errorFor("sku") || undefined}
              />
              <FieldError>{errorFor("sku")}</FieldError>
            </Field>
            <Field data-invalid={!!errorFor("category") || undefined}>
              <FieldTitle>
                Category <span className="text-destructive">*</span>
              </FieldTitle>
              <select
                value={data.category}
                onChange={(e) => update("category", e.target.value)}
                aria-invalid={!!errorFor("category") || undefined}
                className={selectClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <FieldError>{errorFor("category")}</FieldError>
            </Field>
          </div>
          <Field data-invalid={!!errorFor("description") || undefined}>
            <FieldTitle>
              Description <span className="text-destructive">*</span>
            </FieldTitle>
            <Textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              aria-invalid={!!errorFor("description") || undefined}
            />
            <FieldError>{errorFor("description")}</FieldError>
          </Field>
        </FieldGroup>
      </CollapsibleSection>

      {/* Pricing */}
      <CollapsibleSection
        title="Pricing"
        open={openSections.pricing}
        onToggle={() => toggleSection("pricing")}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field data-invalid={!!errorFor("price") || undefined}>
            <FieldTitle>
              Price ($) <span className="text-destructive">*</span>
            </FieldTitle>
            <Input
              value={data.price}
              onChange={(e) => update("price", e.target.value)}
              aria-invalid={!!errorFor("price") || undefined}
            />
            <FieldError>{errorFor("price")}</FieldError>
          </Field>
          <Field data-invalid={!!errorFor("compareAtPrice") || undefined}>
            <FieldTitle>Compare-at Price ($)</FieldTitle>
            <Input
              value={data.compareAtPrice}
              onChange={(e) => update("compareAtPrice", e.target.value)}
              aria-invalid={!!errorFor("compareAtPrice") || undefined}
            />
            <FieldError>{errorFor("compareAtPrice")}</FieldError>
          </Field>
        </div>
      </CollapsibleSection>

      {/* Shipping */}
      <CollapsibleSection
        title="Shipping"
        open={openSections.shipping}
        onToggle={() => toggleSection("shipping")}
      >
        <FieldGroup>
          <Field data-invalid={!!errorFor("weight") || undefined}>
            <FieldTitle>
              Weight (kg) <span className="text-destructive">*</span>
            </FieldTitle>
            <Input
              value={data.weight}
              onChange={(e) => update("weight", e.target.value)}
              aria-invalid={!!errorFor("weight") || undefined}
            />
            <FieldError>{errorFor("weight")}</FieldError>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field data-invalid={!!errorFor("length") || undefined}>
              <FieldTitle>Length (cm)</FieldTitle>
              <Input
                value={data.length}
                onChange={(e) => update("length", e.target.value)}
                aria-invalid={!!errorFor("length") || undefined}
              />
              <FieldError>{errorFor("length")}</FieldError>
            </Field>
            <Field data-invalid={!!errorFor("width") || undefined}>
              <FieldTitle>Width (cm)</FieldTitle>
              <Input
                value={data.width}
                onChange={(e) => update("width", e.target.value)}
                aria-invalid={!!errorFor("width") || undefined}
              />
              <FieldError>{errorFor("width")}</FieldError>
            </Field>
            <Field data-invalid={!!errorFor("height") || undefined}>
              <FieldTitle>Height (cm)</FieldTitle>
              <Input
                value={data.height}
                onChange={(e) => update("height", e.target.value)}
                aria-invalid={!!errorFor("height") || undefined}
              />
              <FieldError>{errorFor("height")}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </CollapsibleSection>

      {/* SEO */}
      <CollapsibleSection
        title="SEO"
        open={openSections.seo}
        onToggle={() => toggleSection("seo")}
      >
        <FieldGroup>
          <Field data-invalid={!!errorFor("metaTitle") || undefined}>
            <FieldTitle>Meta Title</FieldTitle>
            <Input
              value={data.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              aria-invalid={!!errorFor("metaTitle") || undefined}
            />
            <span className="text-xs text-muted-foreground">
              {data.metaTitle.length}/60 characters
            </span>
            <FieldError>{errorFor("metaTitle")}</FieldError>
          </Field>
          <Field data-invalid={!!errorFor("metaDescription") || undefined}>
            <FieldTitle>Meta Description</FieldTitle>
            <Textarea
              value={data.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              rows={2}
              aria-invalid={!!errorFor("metaDescription") || undefined}
            />
            <span className="text-xs text-muted-foreground">
              {data.metaDescription.length}/160 characters
            </span>
            <FieldError>{errorFor("metaDescription")}</FieldError>
          </Field>
          <Field data-invalid={!!errorFor("slug") || undefined}>
            <FieldTitle>
              URL Slug <span className="text-destructive">*</span>
            </FieldTitle>
            <Input
              value={data.slug}
              onChange={(e) => update("slug", e.target.value)}
              aria-invalid={!!errorFor("slug") || undefined}
            />
            <FieldError>{errorFor("slug")}</FieldError>
          </Field>
        </FieldGroup>
      </CollapsibleSection>
    </form>
  )
}

export const productFormCollapsible: MiniAppDefinition = {
  id: "product-form-collapsible",
  name: "Product Edit Form",
  introduction: "A product editing form with collapsible sections.",
  category: "forms",
  difficulty: "hard",
  component: ProductFormCollapsible,
  expectedAnswers: [
    "Validation errors inside collapsed sections are hidden from the user.",
    "If a collapsed section has a field with an error, the section doesn't expand or show any indication of the error.",
    "When the form is submitted with errors in a collapsed section, the user can't see the errors because the section stays collapsed.",
    "Collapsed sections don't automatically open when they contain validation errors.",
    "There is no visual indicator on collapsed sections that contain errors, so the user doesn't know where to look.",
    "Errors in collapsed sections are invisible — the section header doesn't change to indicate a problem.",
    "The form shows an error count but doesn't reveal which collapsed sections contain the errors.",
    "Errors are hidden behind collapsed panels — I can't find what's wrong.",
    "Submitting with errors doesn't open the sections that have problems.",
    "I see an error count but no way to know which section contains the issue.",
    "The form says there are errors but they're buried inside closed accordion panels.",
    "Collapsed sections should auto-expand when they contain invalid fields, but they don't.",
    "Can't find the validation errors because they're inside sections that stay collapsed after submit.",
    "I can't see where the errors are after submitting.",
    "The form says there are errors but I can't find them.",
    "Error messages are hidden inside collapsed sections.",
  ],
  hint: "What happens when the form is submitted with errors?",
  wrongAnswers: [
    "The form fields are too small to read.",
    "The error messages are not descriptive enough.",
    "The form does not have a cancel button.",
    "The validation rules are too strict.",
    "The form layout is confusing or hard to navigate.",
    "The save button is in the wrong position.",
  ],
}
