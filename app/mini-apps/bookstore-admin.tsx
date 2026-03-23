import { createContext, useContext, useState } from "react"
import {
  BookOpenIcon,
  EyeIcon,
  MoonIcon,
  SquarePenIcon,
  SunIcon,
  UsersIcon,
} from "lucide-react"
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router"
import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import type { MiniAppDefinition } from "~/lib/types"

// --- Types ---------------------------------------------------------------

interface Book {
  id: number
  title: string
  authorId: number
  genre: string
  price: number
  year: number
  stock: number
}

interface Author {
  id: number
  name: string
  nationality: string
  bio: string
}

type Section = "books" | "authors"

interface Toast {
  id: number
  message: string
}

// --- Mock data -----------------------------------------------------------

const INITIAL_AUTHORS: Author[] = [
  {
    id: 1,
    name: "Matt Haig",
    nationality: "British",
    bio: "Bestselling author of The Midnight Library and Reasons to Stay Alive.",
  },
  {
    id: 2,
    name: "James Clear",
    nationality: "American",
    bio: "Author and speaker on habits, decision-making, and self-improvement.",
  },
  {
    id: 3,
    name: "Andy Weir",
    nationality: "American",
    bio: "Science fiction writer best known for The Martian and Project Hail Mary.",
  },
  {
    id: 4,
    name: "Richard Osman",
    nationality: "British",
    bio: "Television presenter and novelist, creator of The Thursday Murder Club.",
  },
  {
    id: 5,
    name: "Gabrielle Zevin",
    nationality: "American",
    bio: "Novelist and screenwriter, author of Tomorrow, and Tomorrow, and Tomorrow.",
  },
]

const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    authorId: 1,
    genre: "Fiction",
    price: 14.99,
    year: 2020,
    stock: 42,
  },
  {
    id: 2,
    title: "Atomic Habits",
    authorId: 2,
    genre: "Self-Help",
    price: 16.99,
    year: 2018,
    stock: 87,
  },
  {
    id: 3,
    title: "Project Hail Mary",
    authorId: 3,
    genre: "Sci-Fi",
    price: 15.99,
    year: 2021,
    stock: 31,
  },
  {
    id: 4,
    title: "The Thursday Murder Club",
    authorId: 4,
    genre: "Mystery",
    price: 13.99,
    year: 2020,
    stock: 19,
  },
  {
    id: 5,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    authorId: 5,
    genre: "Fiction",
    price: 17.99,
    year: 2022,
    stock: 55,
  },
]

// --- Shared class strings ------------------------------------------------

const labelCls =
  "text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide block"
const fieldCls =
  "w-full px-2.5 py-[7px] text-[13px] rounded-md border border-zinc-200 dark:border-neutral-800 bg-gray-100 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-200 outline-none font-[inherit] box-border"
const cardCls =
  "bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-neutral-800 rounded-lg p-5"
const mutedCls = "text-gray-500 dark:text-gray-400"
const textCls = "text-gray-900 dark:text-gray-200"
const detailLabel =
  "text-[10px] text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-[0.06em] font-medium"
const detailBox =
  "bg-zinc-50 dark:bg-[#1f1f1f] border border-zinc-200 dark:border-neutral-800 rounded-md"
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

// --- Store context -------------------------------------------------------

interface StoreContext {
  basePath: string
  books: Book[]
  authors: Author[]
  showToast: (message: string) => void
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>
  setAuthors: React.Dispatch<React.SetStateAction<Author[]>>
  nextId: number
  setNextId: React.Dispatch<React.SetStateAction<number>>
}

const StoreCtx = createContext<StoreContext>(null!)
const useStore = () => useContext(StoreCtx)

// --- Route components ----------------------------------------------------

function BooksList() {
  const { basePath, books, authors } = useStore()
  const nav = useNavigate()
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="table-fixed text-sm [&_td]:py-2 [&_td]:whitespace-normal [&_th]:h-auto [&_th]:py-1.5 [&_th]:whitespace-normal">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead className="w-[20%]">Author</TableHead>
            <TableHead className="w-[15%]">Genre</TableHead>
            <TableHead className="w-[12%] text-right">Price</TableHead>
            <TableHead className="w-[10%] text-right">Stock</TableHead>
            <TableHead className="w-[13%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => {
            const author = authors.find((a) => a.id === book.authorId)
            return (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell className={mutedCls}>{author?.name}</TableCell>
                <TableCell>
                  <span
                    className={`rounded border border-zinc-200 px-1.75 py-0.5 text-[11px] dark:border-neutral-800 ${mutedCls}`}
                  >
                    {book.genre}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  ${book.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{book.stock}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => nav(`${basePath}/books/${book.id}`)}
                      aria-label="View book"
                    >
                      <EyeIcon size={13} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => nav(`${basePath}/books/${book.id}/edit`)}
                      aria-label="Edit book"
                    >
                      <SquarePenIcon size={13} />
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function BookShow() {
  const { basePath, books, authors, setBooks, showToast } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const book = books.find((b) => b.id === Number(id))
  if (!book) return null
  const author = authors.find((a) => a.id === book.authorId)
  return (
    <div className={cardCls}>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className={`text-[17px] font-semibold ${textCls}`}>
            {book.title}
          </div>
          <div className={`text-[13px] ${mutedCls} mt-0.5`}>
            by {author?.name}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nav(`${basePath}/books/${book.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setBooks((prev) => prev.filter((b) => b.id !== book.id))
              showToast("Book deleted")
              nav(`${basePath}/books`)
            }}
          >
            Delete
          </Button>
        </div>
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
          <div key={label} className={`p-3 ${detailBox}`}>
            <div className={detailLabel}>{label}</div>
            <div className={`text-sm font-medium ${textCls}`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BookCreate() {
  const { basePath, setBooks, nextId, setNextId, showToast, authors } =
    useStore()
  const nav = useNavigate()
  const [data, setData] = useState<Record<string, string>>({})
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBooks((prev) => [
      ...prev,
      {
        id: nextId,
        title: data["title"] || "Untitled",
        authorId: parseInt(data["authorId"] ?? "1") || 1,
        genre: data["genre"] || "Fiction",
        price: parseFloat(data["price"] ?? "0") || 0,
        year: parseInt(data["year"] ?? "2024") || 2024,
        stock: parseInt(data["stock"] ?? "0") || 0,
      },
    ])
    setNextId((n) => n + 1)
    showToast("Book created successfully")
    nav(`${basePath}/books`)
  }
  return (
    <form className={cardCls} onSubmit={handleSubmit}>
      <div className={`text-sm font-semibold ${textCls} mb-4`}>New Book</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={labelCls}>Author</span>
          <select
            value={data["authorId"] ?? ""}
            onChange={(e) => onChange("authorId", e.target.value)}
            className={`${fieldCls} appearance-auto`}
          >
            <option value="">Select an author…</option>
            {authors.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={labelCls}>Genre</span>
          <select
            value={data["genre"] ?? ""}
            onChange={(e) => onChange("genre", e.target.value)}
            className={`${fieldCls} appearance-auto`}
          >
            <option value="">Select a genre…</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-full">
          <span className={labelCls}>Title</span>
          <input
            value={data["title"] ?? ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Book title"
            className={fieldCls}
          />
        </div>
        {[
          { key: "price", label: "Price ($)", placeholder: "14.99" },
          { key: "year", label: "Year", placeholder: "2024" },
          { key: "stock", label: "Stock", placeholder: "0" },
        ].map((f) => (
          <div key={f.key}>
            <span className={labelCls}>{f.label}</span>
            <input
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={fieldCls}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => nav(`${basePath}/books`)}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Create book
        </Button>
      </div>
    </form>
  )
}

function BookEdit() {
  const { basePath, books, setBooks, showToast, authors } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const bookId = Number(id)
  const book = books.find((b) => b.id === bookId)
  const [data, setData] = useState<Record<string, string>>(
    book
      ? {
          title: book.title,
          authorId: String(book.authorId),
          genre: book.genre,
          price: String(book.price),
          year: String(book.year),
          stock: String(book.stock),
        }
      : {}
  )
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))
  if (!book) return null
  return (
    <form
      className={cardCls}
      onSubmit={(e) => {
        e.preventDefault()
        setBooks((prev) =>
          prev.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  title: data["title"] || b.title,
                  authorId: parseInt(data["authorId"] ?? "0") || b.authorId,
                  genre: data["genre"] || b.genre,
                  price: parseFloat(data["price"] ?? "0") || b.price,
                  year: parseInt(data["year"] ?? "0") || b.year,
                  stock: parseInt(data["stock"] ?? "0") || b.stock,
                }
              : b
          )
        )
        showToast("Book updated successfully")
        nav(`${basePath}/books`)
      }}
    >
      <div className={`text-sm font-semibold ${textCls} mb-4`}>Edit Book</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={labelCls}>Author</span>
          <select
            value={data["authorId"] ?? ""}
            onChange={(e) => onChange("authorId", e.target.value)}
            className={`${fieldCls} appearance-auto`}
          >
            <option value="">Select an author…</option>
            {authors.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={labelCls}>Genre</span>
          <select
            value={data["genre"] ?? ""}
            onChange={(e) => onChange("genre", e.target.value)}
            className={`${fieldCls} appearance-auto`}
          >
            <option value="">Select a genre…</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-full">
          <span className={labelCls}>Title</span>
          <input
            value={data["title"] ?? ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Book title"
            className={fieldCls}
          />
        </div>
        {[
          { key: "price", label: "Price ($)", placeholder: "14.99" },
          { key: "year", label: "Year", placeholder: "2024" },
          { key: "stock", label: "Stock", placeholder: "0" },
        ].map((f) => (
          <div key={f.key}>
            <span className={labelCls}>{f.label}</span>
            <input
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={fieldCls}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => nav(`${basePath}/books/${bookId}`)}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Save changes
        </Button>
      </div>
    </form>
  )
}

function AuthorsList() {
  const { basePath, authors } = useStore()
  const nav = useNavigate()
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="table-fixed text-sm [&_td]:py-2 [&_td]:whitespace-normal [&_th]:h-auto [&_th]:py-1.5 [&_th]:whitespace-normal">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Name</TableHead>
            <TableHead className="w-[20%]">Nationality</TableHead>
            <TableHead className="w-[45%]">Bio</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.id}>
              <TableCell className="font-medium">{author.name}</TableCell>
              <TableCell className={mutedCls}>{author.nationality}</TableCell>
              <TableCell
                className={`${mutedCls} overflow-hidden text-ellipsis`}
              >
                {author.bio}
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-flex gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => nav(`${basePath}/authors/${author.id}`)}
                    aria-label="View author"
                  >
                    <EyeIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => nav(`${basePath}/authors/${author.id}/edit`)}
                    aria-label="Edit author"
                  >
                    <SquarePenIcon size={13} />
                  </Button>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AuthorShow() {
  const { basePath, authors, books, setAuthors, showToast } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const author = authors.find((a) => a.id === Number(id))
  if (!author) return null
  const authorBooks = books.filter((b) => b.authorId === author.id)
  return (
    <div className={`${cardCls} flex flex-col gap-3.5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-[17px] font-semibold ${textCls}`}>
            {author.name}
          </div>
          <div className={`text-[13px] ${mutedCls} mt-0.5`}>
            {author.nationality}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nav(`${basePath}/authors/${author.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setAuthors((prev) => prev.filter((a) => a.id !== author.id))
              showToast("Author deleted")
              nav(`${basePath}/authors`)
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={`p-3.5 ${detailBox}`}>
        <div className={`${detailLabel} mb-1.5`}>Biography</div>
        <div className={`text-[13px] ${textCls} leading-relaxed`}>
          {author.bio}
        </div>
      </div>
      <div>
        <div className={`${detailLabel} mb-2`}>
          Books ({authorBooks.length})
        </div>
        {authorBooks.length === 0 ? (
          <div className={`text-[13px] ${mutedCls}`}>No books on record.</div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {authorBooks.map((b) => (
              <div
                key={b.id}
                className={`flex items-center justify-between px-3 py-2 ${detailBox}`}
              >
                <div>
                  <div className={`text-[13px] font-medium ${textCls}`}>
                    {b.title}
                  </div>
                  <div className={`text-[11px] ${mutedCls} mt-px`}>
                    {b.genre} · {b.year}
                  </div>
                </div>
                <div className={`text-[13px] ${mutedCls}`}>
                  ${b.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AuthorCreate() {
  const { basePath, setAuthors, nextId, setNextId, showToast } = useStore()
  const nav = useNavigate()
  const [data, setData] = useState<Record<string, string>>({})
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthors((prev) => [
      ...prev,
      {
        id: nextId,
        name: data["name"] || "New Author",
        nationality: data["nationality"] || "Unknown",
        bio: data["bio"] || "",
      },
    ])
    setNextId((n) => n + 1)
    showToast("Author created successfully")
    nav(`${basePath}/authors`)
  }
  return (
    <form className={cardCls} onSubmit={handleSubmit}>
      <div className={`text-sm font-semibold ${textCls} mb-4`}>New Author</div>
      <div className="flex flex-col gap-3">
        {[
          { key: "name", label: "Name", placeholder: "Full name" },
          {
            key: "nationality",
            label: "Nationality",
            placeholder: "e.g. British",
          },
        ].map((f) => (
          <div key={f.key}>
            <div className={labelCls}>{f.label}</div>
            <input
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={fieldCls}
            />
          </div>
        ))}
        <div>
          <div className={labelCls}>Biography</div>
          <textarea
            value={data["bio"] ?? ""}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Short biography…"
            rows={3}
            className={`${fieldCls} resize-y`}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => nav(`${basePath}/authors`)}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Create author
        </Button>
      </div>
    </form>
  )
}

function AuthorEdit() {
  const { basePath, authors, setAuthors, showToast } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const authorId = Number(id)
  const author = authors.find((a) => a.id === authorId)
  const [data, setData] = useState<Record<string, string>>(
    author
      ? { name: author.name, nationality: author.nationality, bio: author.bio }
      : {}
  )
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))
  if (!author) return null
  return (
    <form
      className={cardCls}
      onSubmit={(e) => {
        e.preventDefault()
        setAuthors((prev) =>
          prev.map((a) =>
            a.id === authorId
              ? {
                  ...a,
                  name: data["name"] || a.name,
                  nationality: data["nationality"] || a.nationality,
                  bio: data["bio"] || a.bio,
                }
              : a
          )
        )
        showToast("Author updated successfully")
        nav(`${basePath}/authors`)
      }}
    >
      <div className={`text-sm font-semibold ${textCls} mb-4`}>Edit Author</div>
      <div className="flex flex-col gap-3">
        {[
          { key: "name", label: "Name", placeholder: "Full name" },
          {
            key: "nationality",
            label: "Nationality",
            placeholder: "e.g. British",
          },
        ].map((f) => (
          <div key={f.key}>
            <div className={labelCls}>{f.label}</div>
            <input
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={fieldCls}
            />
          </div>
        ))}
        <div>
          <div className={labelCls}>Biography</div>
          <textarea
            value={data["bio"] ?? ""}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Short biography…"
            rows={3}
            className={`${fieldCls} resize-y`}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => nav(`${basePath}/authors/${authorId}`)}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Save changes
        </Button>
      </div>
    </form>
  )
}

// --- Section layout (breadcrumb + Outlet) --------------------------------

function SectionLayout({
  section,
  listLabel,
}: {
  section: Section
  listLabel: string
}) {
  const nav = useNavigate()
  const { "*": splat = "" } = useParams()
  // splat is the path after "books/" or "authors/", e.g. "", "new", "3", "3/edit"
  const parts = splat.split("/").filter(Boolean)
  const { basePath } = useStore()
  const isList = parts.length === 0
  const isCreate = parts[0] === "new"
  const isEdit = parts[1] === "edit"

  const label = isList
    ? listLabel
    : isCreate
      ? `New ${section === "books" ? "Book" : "Author"}`
      : isEdit
        ? `Edit ${section === "books" ? "Book" : "Author"}`
        : `${section === "books" ? "Book" : "Author"} Details`

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-gray-100 px-4 py-2.5 dark:border-neutral-800 dark:bg-[#0d0d0d]">
        <div className={`text-xs ${mutedCls} flex items-center gap-1`}>
          {!isList && (
            <>
              <Button
                variant="link"
                size="xs"
                onClick={() => nav(`${basePath}/${section}`)}
                className="h-auto p-0 text-xs text-blue-600 dark:text-indigo-400"
              >
                {listLabel}
              </Button>
              <span>/</span>
            </>
          )}
          <span className={`${textCls} font-medium`}>{label}</span>
        </div>
        {isList && (
          <Button size="sm" onClick={() => nav(`${basePath}/${section}/new`)}>
            + New {section === "books" ? "Book" : "Author"}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-2 dark:bg-[#0d0d0d]">
        <Outlet />
      </div>
    </>
  )
}

// --- Main component ------------------------------------------------------

function BookstoreAdmin() {
  const { "*": splat = "" } = useParams()
  const location = useLocation()
  // Base path = current pathname minus the splat suffix
  const basePath = splat
    ? location.pathname.slice(0, -splat.length).replace(/\/$/, "")
    : location.pathname.replace(/\/$/, "")
  const section: Section = splat.startsWith("authors") ? "authors" : "books"

  const [isDark, setIsDark] = useState(false)
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS)
  const [authors, setAuthors] = useState<Author[]>(INITIAL_AUTHORS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextId, setNextId] = useState(6)

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const nav = useNavigate()

  const store: StoreContext = {
    basePath,
    books,
    authors,
    showToast,
    setBooks,
    setAuthors,
    nextId,
    setNextId,
  }

  return (
    <StoreCtx.Provider value={store}>
      <div className={`w-full ${isDark ? "dark" : ""}`}>
        <div className="relative flex min-h-105 overflow-hidden rounded-lg bg-gray-100 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200">
          {/* Toast notifications — BUG: dark mode toast has ~1.3:1 contrast ratio (bg #1e1e1e, text #353535) */}
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

          {/* Sidebar */}
          <div className="flex w-30 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#111]">
            <div className="border-b border-zinc-200 px-4 py-3.5 dark:border-neutral-800">
              <div
                className={`text-[13px] font-bold ${textCls} flex items-center gap-1.5`}
              >
                <BookOpenIcon
                  size={16}
                  className="text-blue-600 dark:text-indigo-400"
                />
                Bookstore
              </div>
              <div className={`text-[10px] ${mutedCls} mt-0.5`}>
                Admin Panel
              </div>
            </div>
            <nav className="flex-1 py-2">
              {(["books", "authors"] as Section[]).map((s) => (
                <button
                  key={s}
                  onClick={() => nav(`${basePath}/${s}`)}
                  className={`flex w-full cursor-pointer items-center gap-2 border-none px-4 py-2 text-left text-[13px] ${section === s ? "bg-blue-50 font-semibold text-blue-600 dark:bg-[#1e2640] dark:text-indigo-400" : `font-normal ${mutedCls} bg-transparent`}`}
                >
                  {s === "books" ? (
                    <BookOpenIcon size={14} />
                  ) : (
                    <UsersIcon size={14} />
                  )}
                  <span className="capitalize">{s}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main area */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* App bar */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-neutral-800 dark:bg-[#111]">
              <div className="ml-auto flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsDark((d) => !d)}
                  title={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                </Button>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold tracking-wide text-white">
                  AD
                </div>
              </div>
            </div>

            {/* Routes with layout Outlet */}
            <Routes>
              <Route index element={<Navigate to="books" replace />} />
              <Route
                path="books/*"
                element={<SectionLayout section="books" listLabel="Books" />}
              >
                <Route index element={<BooksList />} />
                <Route path="new" element={<BookCreate />} />
                <Route path=":id" element={<BookShow />} />
                <Route path=":id/edit" element={<BookEdit />} />
              </Route>
              <Route
                path="authors/*"
                element={
                  <SectionLayout section="authors" listLabel="Authors" />
                }
              >
                <Route index element={<AuthorsList />} />
                <Route path="new" element={<AuthorCreate />} />
                <Route path=":id" element={<AuthorShow />} />
                <Route path=":id/edit" element={<AuthorEdit />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </StoreCtx.Provider>
  )
}

// --- Definition ----------------------------------------------------------

export const bookstoreAdmin: MiniAppDefinition = {
  id: "bookstore-admin",
  name: "Bookstore Admin",
  introduction:
    "A back-office admin panel for a bookstore, with list views, detail pages, and create/edit forms for books and authors. Every mutation triggers a confirmation notification.",
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
    "Notification messages are not visible in dark mode due to insufficient contrast between text color and background color.",
    "The app feedback toasts are readable in light mode but invisible in dark mode because the text color is too close to the background.",
  ],
  hint: "Try switching to dark mode and performing actions.",
  wrongAnswers: [
    "The delete button is not styled differently from other actions, making it hard to identify as destructive.",
    "There is no confirmation dialog before deleting a book or author.",
    "The sidebar does not show how many items are in each section.",
    "The theme toggle doesn't persist the preference after a page refresh.",
    "Form fields don't validate required input before submission.",
    "The table lacks sorting and filtering capabilities.",
  ],
}
