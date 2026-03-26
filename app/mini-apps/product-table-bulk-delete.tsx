import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
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
  stock: number
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Classic Oxford Shirt",
    category: "Shirts",
    price: 59.99,
    stock: 24,
  },
  {
    id: 2,
    name: "Slim Fit Chinos",
    category: "Pants",
    price: 79.99,
    stock: 18,
  },
  {
    id: 3,
    name: "Wool Blend Blazer",
    category: "Jackets",
    price: 189.99,
    stock: 7,
  },
  {
    id: 4,
    name: "Crew Neck T-Shirt",
    category: "Shirts",
    price: 24.99,
    stock: 53,
  },
  {
    id: 5,
    name: "Denim Jacket",
    category: "Jackets",
    price: 129.99,
    stock: 12,
  },
  { id: 6, name: "Linen Shorts", category: "Pants", price: 49.99, stock: 31 },
  {
    id: 7,
    name: "Cashmere Sweater",
    category: "Knitwear",
    price: 149.99,
    stock: 9,
  },
  { id: 8, name: "Polo Shirt", category: "Shirts", price: 44.99, stock: 42 },
  { id: 9, name: "Cargo Pants", category: "Pants", price: 69.99, stock: 15 },
  {
    id: 10,
    name: "Puffer Vest",
    category: "Jackets",
    price: 109.99,
    stock: 20,
  },
  {
    id: 11,
    name: "Flannel Shirt",
    category: "Shirts",
    price: 54.99,
    stock: 27,
  },
  {
    id: 12,
    name: "Tailored Trousers",
    category: "Pants",
    price: 89.99,
    stock: 11,
  },
]

// UX BUG: Checkbox only toggles when the click lands very close to its center.
// It looks and behaves like a normal checkbox otherwise, so users won't understand
// why their clicks sometimes "miss".
const CLICK_RADIUS = 4 // pixels from center that count as a hit

function TinyCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  onChange: () => void
  ariaLabel: string
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => {
        // no-op: we handle toggling via onPointerDown
      }}
      onPointerDown={(e) => {
        e.preventDefault()
        const rect = (e.target as HTMLElement).getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        if (Math.sqrt(dx * dx + dy * dy) <= CLICK_RADIUS) {
          onChange()
        }
      }}
      className="cursor-pointer accent-primary"
      aria-label={ariaLabel}
    />
  )
}

function ProductTableBulkDelete() {
  const [products, setProducts] = useState(initialProducts)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(products.map((p) => p.id)))
    }
  }

  function handleDelete() {
    const count = selected.size
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
    setToast(
      `${count} ${count === 1 ? "product" : "products"} deleted successfully.`
    )
  }

  const allSelected = products.length > 0 && selected.size === products.length

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 p-4 text-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {products.length} product{products.length !== 1 && "s"}
        </span>
        <div
          className={`flex items-center gap-2 ${selected.size > 0 ? "visible" : "invisible"}`}
        >
          <span className="text-xs font-medium">{selected.size} selected</span>
          <Dialog>
            <DialogTrigger render={<Button variant="destructive" size="xs" />}>
              Delete selected
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete products</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {selected.size}{" "}
                  {selected.size === 1 ? "product" : "products"}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <DialogClose
                  render={<Button variant="destructive" />}
                  onClick={handleDelete}
                >
                  Delete
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <TinyCheckbox
                  checked={allSelected}
                  onChange={toggleAll}
                  ariaLabel="Select all products"
                />
              </TableHead>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-right text-xs">Price</TableHead>
              <TableHead className="text-right text-xs">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-6 text-center text-muted-foreground"
                >
                  No products remaining.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow
                  key={p.id}
                  className={selected.has(p.id) ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <TinyCheckbox
                      checked={selected.has(p.id)}
                      onChange={() => toggleRow(p.id)}
                      ariaLabel={`Select ${p.name}`}
                    />
                  </TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.category}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${p.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.stock}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {products.length === 0 && (
        <Button
          variant="outline"
          size="xs"
          className="self-center"
          onClick={() => {
            setProducts(initialProducts)
            setSelected(new Set())
          }}
        >
          Reset products
        </Button>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

export const productTableBulkDelete: MiniAppDefinition = {
  id: "product-table-bulk-delete",
  name: "Product Bulk Actions",
  introduction:
    "A product inventory table with the ability to perform bulk actions.",
  category: "lists",
  difficulty: "medium",
  component: ProductTableBulkDelete,
  expectedAnswers: [
    "The checkboxes only register clicks if you hit the exact center. Clicking slightly off-center does nothing.",
    "The checkboxes seem broken or unresponsive. Most clicks don't register because the hit area is tiny.",
    "Clicking the checkboxes often doesn't work. You have to aim very precisely at the center of the checkbox.",
    "The checkboxes have an extremely small clickable area. Clicks near the edge of the checkbox are ignored.",
    "The selection checkboxes are frustrating to use because only clicks in the dead center actually toggle them.",
    "The checkboxes look normal but don't respond to most clicks. The active click target is much smaller than the visible checkbox.",
    "It's very hard to select rows because the checkboxes require pixel-perfect clicking to toggle.",
    "The checkboxes are unreliable — sometimes they work and sometimes they don't, depending on where exactly you click.",
    "The checkboxes are really hard to click — they feel broken.",
    "Most of my clicks on the checkboxes don't register.",
    "The clickable area of the checkboxes is way too small.",
    "Selecting rows is frustrating because the checkboxes barely respond to clicks.",
    "The hit target on the checkboxes is tiny — I have to click perfectly in the center.",
    "Checkboxes don't work properly, you need pixel-perfect precision to toggle them.",
    "The checkboxes are broken.",
    "I can't select rows reliably.",
    "Clicking on a checkbox doesn't always work.",
  ],
  hint: "Try selecting several rows quickly.",
  wrongAnswers: [
    "There is no way to deselect items or clear the selection.",
    "The confirmation dialog is missing or unclear.",
    "The table doesn't support sorting or filtering.",
    "There is no undo after deleting products.",
    "The select all checkbox is confusing.",
    "The table doesn't paginate with many items.",
  ],
}
