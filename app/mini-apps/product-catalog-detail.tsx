import { useEffect, useRef, useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import type { MiniAppDefinition } from "~/lib/types"
import {
  ArrowLeft,
  Headphones,
  Keyboard,
  Cable,
  HardDrive,
  Lamp,
  Video,
  Speaker,
  ShoppingBag,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Trash2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// --- Types & data ---

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number | null
  description: string
  category: string
  rating: number
  reviewCount: number
  image: { bg: string; icon: LucideIcon }
}

const products: Product[] = [
  {
    id: "wireless-earbuds",
    name: "Wireless Earbuds Pro",
    price: 79.99,
    originalPrice: null,
    description:
      "Premium true wireless earbuds with active noise cancellation, 8-hour battery life, and IPX5 water resistance. Includes wireless charging case with USB-C.",
    category: "Audio",
    rating: 4.5,
    reviewCount: 238,
    image: { bg: "#e8f0fe", icon: Headphones },
  },
  {
    id: "mechanical-keyboard",
    name: "Mechanical Keyboard RGB",
    price: 129.99,
    originalPrice: 159.99,
    description:
      "Full-size mechanical keyboard with hot-swappable switches, per-key RGB lighting, and a detachable USB-C cable. Includes wrist rest and keycap puller.",
    category: "Peripherals",
    rating: 4.7,
    reviewCount: 156,
    image: { bg: "#2c3e50", icon: Keyboard },
  },
  {
    id: "usb-c-hub",
    name: "USB-C Hub 7-in-1",
    price: 34.99,
    originalPrice: null,
    description:
      "Compact aluminum hub with HDMI 4K@60Hz, 2x USB-A 3.0, USB-C data, SD/microSD card readers, and 100W power delivery passthrough.",
    category: "Accessories",
    rating: 4.2,
    reviewCount: 412,
    image: { bg: "#dfe6e9", icon: Cable },
  },
  {
    id: "portable-ssd",
    name: "Portable SSD 1TB",
    price: 89.99,
    originalPrice: 109.99,
    description:
      "Ultra-fast external SSD with read speeds up to 1050 MB/s. Shock-resistant aluminum enclosure, USB-C 3.2 Gen 2 interface. Compatible with PC, Mac, and gaming consoles.",
    category: "Storage",
    rating: 4.8,
    reviewCount: 89,
    image: { bg: "#ffeaa7", icon: HardDrive },
  },
  {
    id: "smart-desk-lamp",
    name: "Smart Desk Lamp",
    price: 49.99,
    originalPrice: null,
    description:
      "LED desk lamp with adjustable color temperature (2700K–6500K), brightness dimming, and a built-in USB charging port. Touch controls and 1-hour auto-off timer.",
    category: "Lighting",
    rating: 4.0,
    reviewCount: 67,
    image: { bg: "#fdf2e9", icon: Lamp },
  },
  {
    id: "webcam-4k",
    name: "Webcam 4K Ultra",
    price: 64.99,
    originalPrice: null,
    description:
      "4K UHD webcam with autofocus, built-in privacy shutter, and dual stereo microphones with noise reduction. Works with all major video conferencing apps.",
    category: "Peripherals",
    rating: 4.3,
    reviewCount: 195,
    image: { bg: "#e8daef", icon: Video },
  },
  {
    id: "bluetooth-speaker",
    name: "Bluetooth Speaker 360",
    price: 59.99,
    originalPrice: 79.99,
    description:
      "Portable 360-degree speaker with deep bass, 12-hour battery, and IP67 waterproof rating. Supports stereo pairing with a second speaker for room-filling sound.",
    category: "Audio",
    rating: 4.6,
    reviewCount: 321,
    image: { bg: "#d5f5e3", icon: Speaker },
  },
]

// --- Star rating ---

function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number
  reviewCount: number
  size?: "sm" | "md"
}) {
  const starSize = size === "sm" ? "size-3" : "size-4"
  const textSize = size === "sm" ? "text-[10px]" : "text-xs"

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/40"
            }`}
          />
        ))}
      </div>
      <span className={`${textSize} text-muted-foreground`}>
        ({reviewCount})
      </span>
    </div>
  )
}

// --- Product image placeholder ---

function ProductImage({
  product,
  large,
}: {
  product: Product
  large?: boolean
}) {
  const Icon = product.image.icon
  const isLight =
    product.image.bg.startsWith("#f") ||
    product.image.bg.startsWith("#e") ||
    product.image.bg.startsWith("#d")

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-md ${
        large ? "aspect-square" : "aspect-[4/3]"
      }`}
      style={{ backgroundColor: product.image.bg }}
    >
      <Icon
        className={large ? "size-16" : "size-8"}
        strokeWidth={1.5}
        color={isLight ? "#555" : "#fff"}
        opacity={0.6}
      />
      {product.originalPrice && (
        <div className="absolute top-2 right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )}
          % OFF
        </div>
      )}
    </div>
  )
}

// --- Product card ---

function ProductCard({
  product,
  onClick,
}: {
  product: Product
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer flex-col gap-2 rounded-lg border bg-background p-3 text-left transition-shadow hover:shadow-md"
    >
      <ProductImage product={product} />
      <div className="flex flex-col gap-1">
        <h3 className="text-sm leading-tight font-medium">{product.name}</h3>
        <Badge variant="secondary" className="w-fit text-[10px]">
          {product.category}
        </Badge>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </button>
  )
}

// --- Cart dropdown ---

type Cart = Map<string, number>

function cartTotalItems(cart: Cart): number {
  let total = 0
  for (const qty of cart.values()) total += qty
  return total
}

function cartTotalPrice(cart: Cart): number {
  let total = 0
  for (const [id, qty] of cart) {
    const product = products.find((p) => p.id === id)
    if (product) total += product.price * qty
  }
  return total
}

function CartButton({
  cart,
  onUpdateQty,
  onRemove,
}: {
  cart: Cart
  onUpdateQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const totalItems = cartTotalItems(cart)

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

  if (totalItems === 0) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        <ShoppingCart className="size-4" />
        {totalItems}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-72 rounded-lg border bg-background shadow-lg">
          <div className="p-3">
            <h4 className="text-sm font-semibold">Shopping Cart</h4>
          </div>
          <Separator />
          <div className="flex max-h-60 flex-col gap-0 overflow-y-auto">
            {[...cart.entries()].map(([id, qty]) => {
              const product = products.find((p) => p.id === id)
              if (!product) return null
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-2">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: product.image.bg }}
                  >
                    <product.image.icon
                      className="size-5"
                      strokeWidth={1.5}
                      color={
                        product.image.bg.startsWith("#f") ||
                        product.image.bg.startsWith("#e") ||
                        product.image.bg.startsWith("#d")
                          ? "#555"
                          : "#fff"
                      }
                      opacity={0.6}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-medium">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${(product.price * qty).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        qty === 1 ? onRemove(id) : onUpdateQty(id, -1)
                      }
                      className="rounded p-0.5 hover:bg-muted"
                    >
                      {qty === 1 ? (
                        <Trash2 className="size-3 text-muted-foreground" />
                      ) : (
                        <Minus className="size-3 text-muted-foreground" />
                      )}
                    </button>
                    <span className="w-5 text-center text-xs font-medium">
                      {qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(id, 1)}
                      className="rounded p-0.5 hover:bg-muted"
                    >
                      <Plus className="size-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <Separator />
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">
                ${cartTotalPrice(cart).toFixed(2)}
              </span>
            </div>
            <Button className="w-full" size="sm">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Product detail ---

function ProductDetail({
  product,
  onBack,
  onAddToCart,
  cart,
  onUpdateQty,
  onRemove,
}: {
  product: Product
  onBack: () => void
  onAddToCart: () => void
  cart: Cart
  onUpdateQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="w-fit" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to products
        </Button>
        <CartButton cart={cart} onUpdateQty={onUpdateQty} onRemove={onRemove} />
      </div>

      <ProductImage product={product} large />

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <Badge variant="secondary" className="mt-1">
            {product.category}
          </Badge>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-base text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="md"
        />

        <Separator />

        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <Button className="w-full" onClick={onAddToCart}>
          <ShoppingCart className="size-4" />
          Add to cart
        </Button>
      </div>
    </div>
  )
}

// --- Main component ---

function ProductCatalogDetail() {
  // BUG: Using React state instead of browser history for navigation.
  // The in-app "Back to products" button works, but pressing the browser
  // back button navigates away instead of returning to the product list.
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )
  const [cart, setCart] = useState<Cart>(new Map())

  function addToCart(id: string) {
    setCart((prev) => {
      const next = new Map(prev)
      next.set(id, (next.get(id) ?? 0) + 1)
      return next
    })
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) => {
      const next = new Map(prev)
      const current = next.get(id) ?? 0
      const updated = current + delta
      if (updated <= 0) {
        next.delete(id)
      } else {
        next.set(id, updated)
      }
      return next
    })
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }

  const selectedProduct = selectedProductId
    ? (products.find((p) => p.id === selectedProductId) ?? null)
    : null

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      {selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProductId(null)}
          onAddToCart={() => addToCart(selectedProduct.id)}
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">GadgetVault</h2>
                <p className="text-xs text-muted-foreground">
                  {products.length} products
                </p>
              </div>
            </div>
            <CartButton
              cart={cart}
              onUpdateQty={updateQty}
              onRemove={removeFromCart}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProductId(product.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// --- Definition ---

export const productCatalogDetail: MiniAppDefinition = {
  id: "product-catalog-detail",
  name: "GadgetVault Store",
  introduction:
    "An online electronics store with a product listing and detail pages. The checkout is not implemented.",
  category: "navigation",
  difficulty: "easy",
  component: ProductCatalogDetail,
  expectedAnswers: [
    "The browser back button doesn't return to the product list after viewing a product detail page.",
    "Clicking a product and then pressing the browser back button navigates away from the app instead of going back to the list.",
    "Navigation between list and detail views uses React state instead of browser history, so the back button doesn't work.",
    "The back button in the browser doesn't go back to the product listing — it leaves the entire page.",
    "Product navigation doesn't use browser history, so the back button skips the product list entirely.",
    "When you view a product detail and press the browser back button, you leave the mini-app instead of returning to the product grid.",
    "The URL doesn't change when navigating to a product detail, so browser back navigation is broken.",
  ],
  wrongAnswers: [
    "The product images are just colored placeholders instead of real photos.",
    "There is no search or filter functionality for the products.",
    "The star ratings are not interactive or clickable.",
    "The product prices don't include tax or shipping information.",
    "The checkout button in the cart doesn't go to a real checkout page.",
  ],
}
