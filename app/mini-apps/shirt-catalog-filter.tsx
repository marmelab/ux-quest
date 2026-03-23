import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import type { MiniAppDefinition } from "~/lib/types"

// --- Types & data ---

interface Shirt {
  id: number
  name: string
  style: string
  price: number
  originalPrice: number | null
  colors: { name: string; hex: string }[]
  sizes: string[]
  image: { bg: string; accent: string; pattern: "solid" | "striped" | "plaid" }
}

const shirts: Shirt[] = [
  {
    id: 1,
    name: "Oxford Classic",
    style: "Formal",
    price: 69.99,
    originalPrice: null,
    colors: [
      { name: "White", hex: "#f8f8f8" },
      { name: "Light Blue", hex: "#b8d4e8" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: { bg: "#f0f4f8", accent: "#b8d4e8", pattern: "solid" },
  },
  {
    id: 2,
    name: "Slim Fit Stretch",
    style: "Casual",
    price: 44.99,
    originalPrice: 59.99,
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Charcoal", hex: "#4a4a4a" },
    ],
    sizes: ["S", "M", "L"],
    image: { bg: "#1e3a5f", accent: "#2a4d75", pattern: "solid" },
  },
  {
    id: 3,
    name: "Linen Breeze",
    style: "Casual",
    price: 54.99,
    originalPrice: null,
    colors: [
      { name: "Sand", hex: "#d4c5a0" },
      { name: "Sage", hex: "#8fac8f" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: { bg: "#e8e0d0", accent: "#d4c5a0", pattern: "solid" },
  },
  {
    id: 4,
    name: "Flannel Heritage",
    style: "Casual",
    price: 39.99,
    originalPrice: 64.99,
    colors: [
      { name: "Red Plaid", hex: "#c0392b" },
      { name: "Green Plaid", hex: "#27ae60" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: { bg: "#c0392b", accent: "#2c3e50", pattern: "plaid" },
  },
  {
    id: 5,
    name: "Performance Tech",
    style: "Sport",
    price: 49.99,
    originalPrice: null,
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Grey", hex: "#8a8a8a" },
      { name: "Blue", hex: "#2980b9" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: { bg: "#2c3e50", accent: "#2980b9", pattern: "solid" },
  },
  {
    id: 6,
    name: "Italian Dress Shirt",
    style: "Formal",
    price: 89.99,
    originalPrice: null,
    colors: [
      { name: "White", hex: "#f8f8f8" },
      { name: "Pale Pink", hex: "#f0d0d0" },
    ],
    sizes: ["M", "L", "XL"],
    image: { bg: "#f8f0f0", accent: "#f0d0d0", pattern: "striped" },
  },
  {
    id: 7,
    name: "Denim Western",
    style: "Casual",
    price: 59.99,
    originalPrice: 79.99,
    colors: [
      { name: "Indigo", hex: "#3b5998" },
      { name: "Light Wash", hex: "#87a5c4" },
    ],
    sizes: ["S", "M", "L"],
    image: { bg: "#3b5998", accent: "#5b79b8", pattern: "solid" },
  },
  {
    id: 8,
    name: "Camp Collar Resort",
    style: "Casual",
    price: 34.99,
    originalPrice: 49.99,
    colors: [
      { name: "Cream", hex: "#f5f0e0" },
      { name: "Olive", hex: "#6b8e23" },
    ],
    sizes: ["M", "L", "XL"],
    image: { bg: "#f0ead6", accent: "#6b8e23", pattern: "solid" },
  },
  {
    id: 9,
    name: "Twill Button-Down",
    style: "Formal",
    price: 74.99,
    originalPrice: null,
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "White", hex: "#f8f8f8" },
      { name: "Sky Blue", hex: "#87ceeb" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: { bg: "#e8f0f8", accent: "#87ceeb", pattern: "striped" },
  },
  {
    id: 10,
    name: "Moisture-Wick Polo",
    style: "Sport",
    price: 42.99,
    originalPrice: null,
    colors: [
      { name: "White", hex: "#f8f8f8" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: { bg: "#1e3a5f", accent: "#f8f8f8", pattern: "solid" },
  },
  {
    id: 11,
    name: "Chambray Weekend",
    style: "Casual",
    price: 47.99,
    originalPrice: null,
    colors: [{ name: "Chambray Blue", hex: "#6b8cae" }],
    sizes: ["M", "L"],
    image: { bg: "#6b8cae", accent: "#8bacc8", pattern: "solid" },
  },
  {
    id: 12,
    name: "French Cuff Formal",
    style: "Formal",
    price: 99.99,
    originalPrice: 129.99,
    colors: [
      { name: "White", hex: "#f8f8f8" },
      { name: "Ivory", hex: "#f5f5dc" },
    ],
    sizes: ["M", "L", "XL"],
    image: { bg: "#fafaf5", accent: "#e8e8d8", pattern: "striped" },
  },
]

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"]
const ALL_COLORS = [
  "White",
  "Black",
  "Blue",
  "Navy",
  "Red",
  "Green",
  "Grey",
  "Cream",
  "Pink",
]
const ALL_STYLES = ["Casual", "Formal", "Sport"]
const PRICE_RANGES = ["Under $40", "$40–$60", "$60–$80", "Over $80"]

interface Filters {
  sizes: string[]
  colors: string[]
  styles: string[]
  priceRanges: string[]
  onSaleOnly: boolean
}

const emptyFilters: Filters = {
  sizes: [],
  colors: [],
  styles: [],
  priceRanges: [],
  onSaleOnly: false,
}

function hasActiveFilters(f: Filters) {
  return (
    f.sizes.length > 0 ||
    f.colors.length > 0 ||
    f.styles.length > 0 ||
    f.priceRanges.length > 0 ||
    f.onSaleOnly
  )
}

// --- Shirt image placeholder ---

function ShirtImage({ shirt }: { shirt: Shirt }) {
  const { bg, accent, pattern } = shirt.image
  return (
    <div
      className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-md"
      style={{ backgroundColor: bg }}
    >
      {/* Shirt silhouette */}
      <svg viewBox="0 0 100 120" className="h-[70%] w-[70%] opacity-80">
        {pattern === "striped" && (
          <defs>
            <pattern
              id={`stripes-${shirt.id}`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill={accent} />
              <line x1="0" y1="0" x2="6" y2="0" stroke={bg} strokeWidth="2" />
            </pattern>
          </defs>
        )}
        {pattern === "plaid" && (
          <defs>
            <pattern
              id={`plaid-${shirt.id}`}
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill={accent} />
              <rect x="0" y="0" width="6" height="6" fill={bg} opacity="0.3" />
              <rect x="6" y="6" width="6" height="6" fill={bg} opacity="0.3" />
            </pattern>
          </defs>
        )}
        <path
          d="M30 15 L20 20 L5 35 L15 45 L25 35 L25 105 L75 105 L75 35 L85 45 L95 35 L80 20 L70 15 Q60 25 50 25 Q40 25 30 15Z"
          fill={
            pattern === "striped"
              ? `url(#stripes-${shirt.id})`
              : pattern === "plaid"
                ? `url(#plaid-${shirt.id})`
                : accent
          }
          stroke={bg === "#f8f8f8" || bg === "#fafaf5" ? "#ddd" : "none"}
          strokeWidth="0.5"
        />
        {/* Collar */}
        <path
          d="M30 15 Q40 5 50 8 Q60 5 70 15 Q60 20 50 22 Q40 20 30 15Z"
          fill={
            bg === "#f8f8f8" || bg === "#fafaf5" || bg === "#f8f0f0"
              ? "#e8e8e8"
              : accent
          }
          opacity="0.7"
        />
        {/* Buttons */}
        <circle cx="50" cy="40" r="1.2" fill={bg} opacity="0.5" />
        <circle cx="50" cy="52" r="1.2" fill={bg} opacity="0.5" />
        <circle cx="50" cy="64" r="1.2" fill={bg} opacity="0.5" />
        <circle cx="50" cy="76" r="1.2" fill={bg} opacity="0.5" />
      </svg>
      {shirt.originalPrice && (
        <div className="absolute top-2 right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {Math.round(
            ((shirt.originalPrice - shirt.price) / shirt.originalPrice) * 100
          )}
          % OFF
        </div>
      )}
    </div>
  )
}

// --- Filter dropdown ---

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </span>
      {children}
    </div>
  )
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-muted/50">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      {label}
    </label>
  )
}

function FilterDropdown({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Filters) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  function toggleArrayFilter(
    key: "sizes" | "colors" | "styles" | "priceRanges",
    value: string
  ) {
    const arr = filters[key]
    onChange({
      ...filters,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    })
  }

  return (
    <div ref={ref} className="relative">
      {/* BUG: The filter button shows no indication that filters are active.
         No badge count, no dot indicator, no color change — the button looks
         identical whether 0 or 5 filters are applied. When the dropdown is closed,
         users have no way to know the list is filtered. */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-icon="inline-start"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-72 rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <FilterSection title="Size">
              <div className="flex flex-wrap gap-1">
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleArrayFilter("sizes", s)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      filters.sizes.includes(s)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Color">
              <div className="flex flex-col gap-0.5">
                {ALL_COLORS.map((c) => (
                  <FilterCheckbox
                    key={c}
                    label={c}
                    checked={filters.colors.includes(c)}
                    onChange={() => toggleArrayFilter("colors", c)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Style">
              <div className="flex flex-wrap gap-1">
                {ALL_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleArrayFilter("styles", s)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      filters.styles.includes(s)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price">
              <div className="flex flex-col gap-0.5">
                {PRICE_RANGES.map((r) => (
                  <FilterCheckbox
                    key={r}
                    label={r}
                    checked={filters.priceRanges.includes(r)}
                    onChange={() => toggleArrayFilter("priceRanges", r)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Discount">
              <FilterCheckbox
                label="On sale only"
                checked={filters.onSaleOnly}
                onChange={(v) => onChange({ ...filters, onSaleOnly: v })}
              />
            </FilterSection>

            {hasActiveFilters(filters) && (
              <button
                onClick={() => onChange({ ...emptyFilters })}
                className="mt-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Shirt card ---

function ShirtCard({ shirt }: { shirt: Shirt }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-3 transition-shadow hover:shadow-md">
      <ShirtImage shirt={shirt} />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm leading-tight font-medium">{shirt.name}</h3>
            <span className="text-xs text-muted-foreground">{shirt.style}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold">
              ${shirt.price.toFixed(2)}
            </span>
            {shirt.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">
                ${shirt.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {shirt.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="inline-block size-4 rounded-full border border-border"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {shirt.sizes.map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px]">
              {s}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Filter logic ---

function matchesPriceRange(price: number, range: string): boolean {
  switch (range) {
    case "Under $40":
      return price < 40
    case "$40–$60":
      return price >= 40 && price <= 60
    case "$60–$80":
      return price > 60 && price <= 80
    case "Over $80":
      return price > 80
    default:
      return false
  }
}

function matchesColorFilter(
  shirtColors: { name: string }[],
  filterColors: string[]
): boolean {
  return shirtColors.some((c) => {
    const lower = c.name.toLowerCase()
    return filterColors.some((f) => lower.includes(f.toLowerCase()))
  })
}

// --- Main component ---

function ShirtCatalogFilter() {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters })

  const filtered = useMemo(() => {
    return shirts.filter((shirt) => {
      if (
        filters.sizes.length > 0 &&
        !shirt.sizes.some((s) => filters.sizes.includes(s))
      )
        return false
      if (
        filters.colors.length > 0 &&
        !matchesColorFilter(shirt.colors, filters.colors)
      )
        return false
      if (filters.styles.length > 0 && !filters.styles.includes(shirt.style))
        return false
      if (
        filters.priceRanges.length > 0 &&
        !filters.priceRanges.some((r) => matchesPriceRange(shirt.price, r))
      )
        return false
      if (filters.onSaleOnly && !shirt.originalPrice) return false
      return true
    })
  }, [filters])

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Men&apos;s Shirts</h2>
          <p className="text-xs text-muted-foreground">
            {filtered.length} shirt{filtered.length !== 1 && "s"}
          </p>
        </div>
        <FilterDropdown filters={filters} onChange={setFilters} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2 text-muted-foreground/50"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <p className="text-sm text-muted-foreground">No shirts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((shirt) => (
            <ShirtCard key={shirt.id} shirt={shirt} />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Definition ---

export const shirtCatalogFilter: MiniAppDefinition = {
  id: "shirt-catalog-filter",
  name: "Men's Shirt Shop",
  introduction: "A filterable list of products for an e-commerce site.",
  category: "lists",
  difficulty: "medium",
  component: ShirtCatalogFilter,
  expectedAnswers: [
    "There is no visual indication that filters are active when the filter dropdown is closed.",
    "After applying filters and closing the dropdown, the filter button looks the same as when no filters are applied.",
    "The filter button doesn't show a badge or count of active filters, so users don't know the list is filtered.",
    "When filters are applied, there are no filter chips or tags visible to indicate what's being filtered.",
    "Users might think the store has limited inventory because there's no indication that filters are narrowing the results.",
    "The filter state is invisible once the dropdown closes — no badge, no dot, no highlighted button, nothing.",
    "There's no way to tell filters are active without reopening the dropdown. The button looks identical whether filtered or not.",
    "Closing the filter dropdown hides all evidence that filters are applied, making a small or empty list misleading.",
  ],
  hint: "Apply some filters.",
  wrongAnswers: [
    "The product images are low quality or missing.",
    "The filter dropdown is hard to open or close.",
    "The shirts don't have enough size options.",
    "The prices are not sorted from low to high.",
    "The grid layout doesn't adapt to different screen sizes.",
    "The discount percentages are not displayed clearly.",
  ],
}
