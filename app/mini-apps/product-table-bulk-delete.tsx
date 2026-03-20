import { useState } from "react"
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

function ProductTableBulkDelete() {
  const [products, setProducts] = useState(initialProducts)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // BUG: the checkbox click targets are tiny — only the checkbox itself is clickable,
  // not the surrounding cell or row. Normally the clickable area should be much larger.

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
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  const allSelected = products.length > 0 && selected.size === products.length

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 text-sm">
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
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="cursor-pointer accent-primary"
                  aria-label="Select all products"
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
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleRow(p.id)}
                      className="cursor-pointer accent-primary"
                      aria-label={`Select ${p.name}`}
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
    </div>
  )
}

export const productTableBulkDelete: MiniAppDefinition = {
  id: "product-table-bulk-delete",
  name: "Product Bulk Actions",
  introduction:
    "A product inventory table with checkboxes for selecting rows and performing bulk actions.",
  category: "lists",
  difficulty: "medium",
  component: ProductTableBulkDelete,
  expectedAnswers: [
    "The checkboxes have a very small click target — you have to click exactly on the tiny checkbox.",
    "The clickable area for selecting rows is too small. Only the checkbox itself is clickable, not the cell or row.",
    "The hit area for the checkboxes is tiny. Clicking near the checkbox but not exactly on it does nothing.",
    "The selection checkboxes are hard to click because the click target doesn't extend to the full cell.",
    "You have to precisely aim at the small checkbox to select a row. The surrounding area is not clickable.",
    "The checkbox click targets are too small — the row or cell should also toggle the selection.",
    "Clicking the table cell around the checkbox doesn't toggle it, only clicking the tiny checkbox itself works.",
    "The checkboxes are small and hard to click. The clickable zone should be larger than just the checkbox.",
    "Clicking anywhere on the row should toggle the selection, but only the tiny checkbox works.",
    "The entire row should be clickable to select it, but you have to click the small checkbox precisely.",
  ],
  wrongAnswers: [
    "There is no way to deselect items or clear the selection.",
    "The confirmation dialog is missing or unclear.",
    "The table doesn't support sorting or filtering.",
    "There is no undo after deleting products.",
    "The select all checkbox is confusing.",
    "The table doesn't paginate with many items.",
  ],
}
