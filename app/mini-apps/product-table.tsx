import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import type { MiniAppDefinition } from "~/lib/types"

interface Product {
  id: number
  name: string
  category: string
  price: number
  size: string
  color: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Classic Oxford Shirt",
    category: "Shirts",
    price: 59.99,
    size: "M",
    color: "White",
  },
  {
    id: 2,
    name: "Slim Fit Chinos",
    category: "Pants",
    price: 79.99,
    size: "32",
    color: "Khaki",
  },
  {
    id: 3,
    name: "Wool Blend Blazer",
    category: "Jackets",
    price: 189.99,
    size: "L",
    color: "Navy",
  },
  {
    id: 4,
    name: "Crew Neck T-Shirt",
    category: "Shirts",
    price: 24.99,
    size: "S",
    color: "Black",
  },
  {
    id: 5,
    name: "Denim Jacket",
    category: "Jackets",
    price: 129.99,
    size: "M",
    color: "Indigo",
  },
  {
    id: 6,
    name: "Linen Shorts",
    category: "Pants",
    price: 49.99,
    size: "L",
    color: "Beige",
  },
  {
    id: 7,
    name: "Cashmere Sweater",
    category: "Knitwear",
    price: 149.99,
    size: "M",
    color: "Grey",
  },
  {
    id: 8,
    name: "Polo Shirt",
    category: "Shirts",
    price: 44.99,
    size: "XL",
    color: "Green",
  },
  {
    id: 9,
    name: "Cargo Pants",
    category: "Pants",
    price: 69.99,
    size: "34",
    color: "Olive",
  },
  {
    id: 10,
    name: "Puffer Vest",
    category: "Jackets",
    price: 109.99,
    size: "S",
    color: "Black",
  },
  {
    id: 11,
    name: "Flannel Shirt",
    category: "Shirts",
    price: 54.99,
    size: "L",
    color: "Red",
  },
  {
    id: 12,
    name: "Tailored Trousers",
    category: "Pants",
    price: 89.99,
    size: "30",
    color: "Charcoal",
  },
  {
    id: 13,
    name: "Merino V-Neck",
    category: "Knitwear",
    price: 79.99,
    size: "M",
    color: "Burgundy",
  },
  {
    id: 14,
    name: "Rain Jacket",
    category: "Jackets",
    price: 139.99,
    size: "XL",
    color: "Yellow",
  },
  {
    id: 15,
    name: "Henley Shirt",
    category: "Shirts",
    price: 34.99,
    size: "S",
    color: "Navy",
  },
  {
    id: 16,
    name: "Jogger Pants",
    category: "Pants",
    price: 59.99,
    size: "M",
    color: "Grey",
  },
  {
    id: 17,
    name: "Cable Knit Cardigan",
    category: "Knitwear",
    price: 119.99,
    size: "L",
    color: "Cream",
  },
  {
    id: 18,
    name: "Bomber Jacket",
    category: "Jackets",
    price: 159.99,
    size: "M",
    color: "Black",
  },
]

type SortKey = keyof Product
type SortDir = "asc" | "desc"

const PAGE_SIZE = 5

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "size", label: "Size" },
  { key: "color", label: "Color" },
  { key: "price", label: "Price", align: "right" },
]

function ProductTable() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [page, setPage] = useState(1)

  // BUG: sorting and filtering do NOT reset page to 1

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
    )
  }, [search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp =
        typeof av === "number"
          ? av - (bv as number)
          : String(av).localeCompare(String(bv))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 p-4 text-sm">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-transparent px-3 py-1.5 pr-8 outline-none focus:border-ring"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`cursor-pointer text-xs select-none hover:text-foreground ${col.align === "right" ? "text-right" : ""}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-6 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.category}
                  </TableCell>
                  <TableCell>{p.size}</TableCell>
                  <TableCell>{p.color}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${p.price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {sorted.length} product{sorted.length !== 1 && "s"}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer rounded px-2 py-1 text-xs hover:bg-muted disabled:cursor-default disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`cursor-pointer rounded px-2 py-1 text-xs ${n === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer rounded px-2 py-1 text-xs hover:bg-muted disabled:cursor-default disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export const productTable: MiniAppDefinition = {
  id: "product-table",
  name: "Product Catalog",
  introduction:
    "A product catalog with search, sorting, and pagination. Browse the clothing items and try out the different features.",
  category: "lists",
  difficulty: "medium",
  component: ProductTable,
  expectedAnswers: [
    "The pagination doesn't reset to page 1 when you filter or sort the list.",
    "When you search or change the sort order, the page number stays the same instead of going back to the first page.",
    "Filtering or sorting doesn't reset the current page, so you can end up on an empty or wrong page.",
    "After typing in the search field, the pagination remains on the current page instead of resetting to page 1.",
    "Changing the sort order doesn't reset pagination, so you see a different slice of data than expected.",
    "The page doesn't reset when the data changes — sorting or filtering keeps you on the same page number.",
    "When you filter the results down, you might see an empty page because the pagination wasn't reset.",
    "Sorting and filtering should bring the user back to page 1 but they don't.",
    "Searching when on another page than page 1 shows no results because search doesn't reset to page 1.",
  ],
  hint: "Start by navigating to page 2.",
  wrongAnswers: [
    "The search is too slow or laggy.",
    "The table doesn't show enough columns.",
    "The sort indicators are confusing.",
    "The table rows are not clickable.",
    "There is no way to select or delete products.",
    "The price formatting is wrong.",
  ],
}
