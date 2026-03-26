import { useEffect, useRef, useState } from "react"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  MoonIcon,
  PlusIcon,
  SquarePenIcon,
  SunIcon,
  TrashIcon,
  XIcon,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import type { MiniAppDefinition } from "~/lib/types"

// --- Types ---------------------------------------------------------------

interface Book {
  id: number
  title: string
  author: string
  genre: string
  price: number
  year: number
  stock: number
}

interface Toast {
  id: number
  message: string
}

type Screen = { kind: "list" } | { kind: "show"; bookId: number }

// --- Mock data -----------------------------------------------------------

const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    price: 14.99,
    year: 2020,
    stock: 42,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    price: 16.99,
    year: 2018,
    stock: 87,
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    price: 15.99,
    year: 2021,
    stock: 31,
  },
  {
    id: 4,
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    genre: "Mystery",
    price: 13.99,
    year: 2020,
    stock: 19,
  },
  {
    id: 5,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    genre: "Fiction",
    price: 17.99,
    year: 2022,
    stock: 55,
  },
]

const GENRES = [
  "Fiction",
  "Self-Help",
  "Sci-Fi",
  "Mystery",
  "Biography",
  "History",
  "Romance",
  "Thriller",
  "Fantasy",
]

// --- Shared class strings ------------------------------------------------

const mutedCls = "text-gray-500 dark:text-gray-400"
const textCls = "text-gray-900 dark:text-gray-200"
const labelCls =
  "text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide block"
const fieldCls =
  "w-full px-3 py-2.5 text-[15px] rounded-lg border border-zinc-200 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-200 outline-none font-[inherit] box-border"

// --- Bottom sheet --------------------------------------------------------

function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      timerRef.current = setTimeout(() => setVisible(true), 20)
    } else {
      setVisible(false)
      timerRef.current = setTimeout(() => setMounted(false), 200)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [open])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      setMounted(false)
      onClose()
    }, 200)
  }

  if (!mounted) return null

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col bg-white transition-transform duration-200 ease-out dark:bg-[#1a1a1a] ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex h-13 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-neutral-800">
        <h3 className={`text-[16px] font-semibold ${textCls}`}>{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          aria-label="Close"
        >
          <XIcon size={20} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </div>
  )
}

// --- Screen components ---------------------------------------------------

function BookList({
  books,
  onSelect,
}: {
  books: Book[]
  onSelect: (id: number) => void
}) {
  return (
    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-neutral-800">
      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => onSelect(book.id)}
          className="flex cursor-pointer items-start justify-between bg-transparent px-4 py-3.5 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className={`text-[14px] font-medium ${textCls}`}>
              {book.title}
            </div>
            <div className={`text-[12px] ${mutedCls} mt-0.5`}>
              {book.author}
            </div>
          </div>
          <div className="ml-3 flex shrink-0 flex-col items-end">
            <span
              className={`rounded-md border border-zinc-200 px-1.5 py-0.5 text-[11px] dark:border-neutral-700 ${mutedCls}`}
            >
              {book.genre}
            </span>
            <span className={`mt-1 text-[12px] font-medium ${textCls}`}>
              ${book.price.toFixed(2)}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}

function BookShow({
  book,
  onSave,
  onDelete,
}: {
  book: Book
  onSave: (updated: Book) => void
  onDelete: () => void
}) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className={`text-[18px] font-semibold ${textCls}`}>
          {book.title}
        </div>
        <div className={`text-[13px] ${mutedCls} mt-0.5`}>by {book.author}</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {(
          [
            ["Genre", book.genre],
            ["Price", `$${book.price.toFixed(2)}`],
            ["Published", book.year],
            ["Stock", `${book.stock} copies`],
          ] as [string, string | number][]
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-800 dark:bg-[#1f1f1f]"
          >
            <div className="text-[10px] font-medium tracking-[0.06em] text-gray-500 uppercase dark:text-gray-400">
              {label}
            </div>
            <div className={`mt-0.5 text-[14px] font-medium ${textCls}`}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <Button
        className="h-11"
        variant="outline"
        onClick={() => setEditOpen(true)}
      >
        <SquarePenIcon size={16} />
        Edit book
      </Button>

      <BottomSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Book"
      >
        <BookEditForm
          book={book}
          onSave={(updated) => {
            setEditOpen(false)
            onSave(updated)
          }}
          onDelete={() => {
            setEditOpen(false)
            onDelete()
          }}
        />
      </BottomSheet>
    </div>
  )
}

function BookEditForm({
  book,
  onSave,
  onDelete,
}: {
  book: Book
  onSave: (updated: Book) => void
  onDelete: () => void
}) {
  const [data, setData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    price: String(book.price),
    year: String(book.year),
    stock: String(book.stock),
  })
  const [titleError, setTitleError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!data.title.trim()) {
          setTitleError(true)
          return
        }
        onSave({
          ...book,
          title: data.title.trim(),
          author: data.author || book.author,
          genre: data.genre || book.genre,
          price: parseFloat(data.price) || book.price,
          year: parseInt(data.year) || book.year,
          stock: parseInt(data.stock) || book.stock,
        })
      }}
    >
      <div>
        <span className={labelCls}>
          Title <span className="text-red-500">*</span>
        </span>
        <input
          value={data.title}
          onChange={(e) => {
            onChange("title", e.target.value)
            if (e.target.value.trim()) setTitleError(false)
            else setTitleError(true)
          }}
          className={`${fieldCls} ${titleError ? "border-red-500 dark:border-red-500" : ""}`}
        />
        {titleError && (
          <span className="mt-1 block text-[12px] text-red-500">
            Title is required
          </span>
        )}
      </div>
      <div>
        <span className={labelCls}>Author</span>
        <input
          value={data.author}
          onChange={(e) => onChange("author", e.target.value)}
          className={fieldCls}
        />
      </div>
      <div>
        <span className={labelCls}>Genre</span>
        <select
          value={data.genre}
          onChange={(e) => onChange("genre", e.target.value)}
          className={`${fieldCls} appearance-auto`}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <span className={labelCls}>Price ($)</span>
          <input
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="14.99"
            className={fieldCls}
          />
        </div>
        <div>
          <span className={labelCls}>Year</span>
          <input
            value={data.year}
            onChange={(e) => onChange("year", e.target.value)}
            placeholder="2024"
            className={fieldCls}
          />
        </div>
        <div>
          <span className={labelCls}>Stock</span>
          <input
            value={data.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            placeholder="0"
            className={fieldCls}
          />
        </div>
      </div>
      <Button type="submit" className="mt-1 h-11 w-full">
        Save changes
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="h-11 w-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        onClick={() => setConfirmDelete(true)}
      >
        <TrashIcon size={16} />
        Delete book
      </Button>
      {confirmDelete && (
        <div className="absolute inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmDelete(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-xs rounded-xl bg-white p-5 shadow-lg dark:bg-[#1a1a1a]">
            <h4 className={`text-[15px] font-semibold ${textCls}`}>
              Delete book?
            </h4>
            <p className={`mt-1 text-[13px] ${mutedCls}`}>
              This action cannot be undone. The book will be permanently
              removed.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-11 flex-1"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

function BookCreateForm({
  onCreate,
}: {
  onCreate: (book: Omit<Book, "id">) => void
}) {
  const [data, setData] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    price: "",
    year: "",
    stock: "",
  })
  const [titleError, setTitleError] = useState(false)
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!data.title.trim()) {
          setTitleError(true)
          return
        }
        onCreate({
          title: data.title.trim(),
          author: data.author || "Unknown",
          genre: data.genre,
          price: parseFloat(data.price) || 0,
          year: parseInt(data.year) || new Date().getFullYear(),
          stock: parseInt(data.stock) || 0,
        })
      }}
    >
      <div>
        <span className={labelCls}>
          Title <span className="text-red-500">*</span>
        </span>
        <input
          value={data.title}
          onChange={(e) => {
            onChange("title", e.target.value)
            if (e.target.value.trim()) setTitleError(false)
            else setTitleError(true)
          }}
          placeholder="Book title"
          className={`${fieldCls} ${titleError ? "border-red-500 dark:border-red-500" : ""}`}
        />
        {titleError && (
          <span className="mt-1 block text-[12px] text-red-500">
            Title is required
          </span>
        )}
      </div>
      <div>
        <span className={labelCls}>Author</span>
        <input
          value={data.author}
          onChange={(e) => onChange("author", e.target.value)}
          placeholder="Author name"
          className={fieldCls}
        />
      </div>
      <div>
        <span className={labelCls}>Genre</span>
        <select
          value={data.genre}
          onChange={(e) => onChange("genre", e.target.value)}
          className={`${fieldCls} appearance-auto`}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <span className={labelCls}>Price ($)</span>
          <input
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="14.99"
            className={fieldCls}
          />
        </div>
        <div>
          <span className={labelCls}>Year</span>
          <input
            value={data.year}
            onChange={(e) => onChange("year", e.target.value)}
            placeholder="2024"
            className={fieldCls}
          />
        </div>
        <div>
          <span className={labelCls}>Stock</span>
          <input
            value={data.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            placeholder="0"
            className={fieldCls}
          />
        </div>
      </div>
      <Button type="submit" className="mt-1 h-11 w-full">
        Create book
      </Button>
    </form>
  )
}

// --- Main component ------------------------------------------------------

function BookstoreAdmin() {
  const [isDark, setIsDark] = useState(false)
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS)
  const [nextId, setNextId] = useState(6)
  const [screen, setScreen] = useState<Screen>({ kind: "list" })
  const [toasts, setToasts] = useState<Toast[]>([])
  const [createOpen, setCreateOpen] = useState(false)

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const currentBook =
    screen.kind === "show"
      ? books.find((b) => b.id === screen.bookId)
      : undefined

  const title =
    screen.kind === "list" ? "Books" : (currentBook?.title ?? "Book")

  return (
    <div className={`w-full ${isDark ? "dark" : ""}`}>
      <div className="relative mx-auto flex min-h-140 w-sm flex-col overflow-hidden rounded-lg bg-gray-50 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200">
        {/* Toast notifications — BUG: dark mode toast has ~1.3:1 contrast ratio */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col-reverse items-center gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="flex min-w-55 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[13px] font-medium text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-[#252525] dark:bg-[#1e1e1e] dark:text-[#353535] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                ✓
              </span>
              {toast.message}
            </div>
          ))}
        </div>

        {/* App bar */}
        <div className="flex h-13 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-2 dark:border-neutral-800 dark:bg-[#111]">
          {screen.kind !== "list" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScreen({ kind: "list" })}
              aria-label="Go back"
            >
              <ArrowLeftIcon size={20} />
            </Button>
          )}
          {screen.kind === "list" && (
            <div className="flex items-center gap-2 pl-2">
              <BookOpenIcon
                size={18}
                className="text-blue-600 dark:text-indigo-400"
              />
              <span className={`text-[16px] font-bold ${textCls}`}>
                Bookstore
              </span>
            </div>
          )}
          {screen.kind !== "list" && (
            <span className={`text-[16px] font-semibold ${textCls} truncate`}>
              {title}
            </span>
          )}
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {screen.kind === "list" && (
            <>
              <BookList
                books={books}
                onSelect={(id) => setScreen({ kind: "show", bookId: id })}
              />
              <button
                onClick={() => setCreateOpen(true)}
                className="absolute right-4 bottom-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg active:bg-blue-700 dark:bg-indigo-500 dark:active:bg-indigo-600"
                aria-label="Add new book"
              >
                <PlusIcon size={24} />
              </button>
            </>
          )}
          {screen.kind === "show" && currentBook && (
            <BookShow
              book={currentBook}
              onSave={(updated) => {
                setBooks((prev) =>
                  prev.map((b) => (b.id === updated.id ? updated : b))
                )
                showToast("Book updated successfully")
              }}
              onDelete={() => {
                setBooks((prev) => prev.filter((b) => b.id !== currentBook.id))
                showToast("Book deleted")
                setScreen({ kind: "list" })
              }}
            />
          )}

          {/* Create drawer */}
          <BottomSheet
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            title="New Book"
          >
            <BookCreateForm
              onCreate={(bookData) => {
                const id = nextId
                setNextId((n) => n + 1)
                setBooks((prev) => [...prev, { id, ...bookData }])
                setCreateOpen(false)
                showToast("Book created successfully")
                setScreen({ kind: "show", bookId: id })
              }}
            />
          </BottomSheet>
        </div>
      </div>
    </div>
  )
}

// --- Definition ----------------------------------------------------------

export const bookstoreAdmin: MiniAppDefinition = {
  id: "bookstore-admin",
  name: "Bookstore Admin",
  introduction: "A mobile admin panel for a bookstore.",
  category: "feedback",
  difficulty: "hard",
  component: BookstoreAdmin,
  expectedAnswers: [
    "In dark mode, toast notifications have insufficient contrast: dark grey text on a near-black background makes them unreadable.",
    "The notification toasts are invisible in dark mode because the text and background colors are both very dark.",
    "When the dark theme is active, confirmation messages after save or delete are illegible due to poor contrast.",
    "The success toasts blend into the dark background in dark mode, making action feedback invisible to the user.",
    "In dark mode, the notification text doesn't have enough contrast against the notification background.",
    "After saving or deleting a record in dark mode, the confirmation toast is effectively invisible because both text and background are dark grey.",
    "Dark mode notifications fail contrast accessibility requirements — the toast text is near-black on a dark grey background.",
    "Can't read the toast messages in dark mode.",
    "The toasts have no contrast in dark theme, text blends into the background.",
    "Switching to dark mode makes the confirmation popups unreadable.",
    "No feedback is visible after saving or deleting when using dark mode.",
    "Dark mode breaks toast readability — the colors are too similar.",
    "I can't see any confirmation when I save or delete in dark mode.",
  ],
  hint: "Try switching to dark mode and performing actions.",
  wrongAnswers: [
    "The delete button is not styled differently from other actions, making it hard to identify as destructive.",
    "There is no confirmation dialog before deleting a book.",
    "The theme toggle doesn't persist the preference after a page refresh.",
    "Form fields don't validate required input before submission.",
    "The book list lacks sorting and filtering capabilities.",
    "There is no way to add a new book to the collection.",
  ],
}
