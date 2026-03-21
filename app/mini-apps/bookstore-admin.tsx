import { useState } from "react"
import { Button } from "~/components/ui/button"
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
type View = "list" | "show" | "create" | "edit"

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

// --- Theme ---------------------------------------------------------------

const LIGHT = {
  root: "#f5f6f8",
  sidebar: "#ffffff",
  appbar: "#ffffff",
  card: "#ffffff",
  text: "#111111",
  muted: "#6b7280",
  border: "#e4e4e7",
  row: "#ffffff",
  rowAlt: "#fafafa",
  activeSidebar: "#eff6ff",
  activeSidebarText: "#2563eb",
  // Toast — light mode: white card with dark text, clearly readable
  toastBg: "#ffffff",
  toastText: "#111111",
  toastBorder: "#d1d5db",
  toastShadow: "0 4px 12px rgba(0,0,0,0.10)",
}

// BUG: In dark mode, toast notifications use a very dark background (#1e1e1e)
// with near-black text (#353535). The contrast ratio is ~1.3:1, far below the
// WCAG AA minimum of 4.5:1, making confirmation messages effectively invisible
// right after save, update, or delete actions.
const DARK = {
  root: "#0d0d0d",
  sidebar: "#111111",
  appbar: "#111111",
  card: "#1a1a1a",
  text: "#e8e8e8",
  muted: "#9ca3af",
  border: "#262626",
  row: "#1a1a1a",
  rowAlt: "#1f1f1f",
  activeSidebar: "#1e2640",
  activeSidebarText: "#818cf8",
  // BUG: Both toastBg and toastText are near-black — toast is invisible in dark mode
  toastBg: "#1e1e1e",
  toastText: "#353535",
  toastBorder: "#252525",
  toastShadow: "0 4px 12px rgba(0,0,0,0.40)",
}

type Theme = typeof LIGHT

// --- Helpers -------------------------------------------------------------


function fieldStyle(T: Theme): React.CSSProperties {
  return {
    width: "100%",
    padding: "7px 10px",
    fontSize: 13,
    borderRadius: 6,
    border: `1px solid ${T.border}`,
    backgroundColor: T.root,
    color: T.text,
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  }
}

// --- Sub-components ------------------------------------------------------

function BooksList({
  books,
  authors,
  T,
  onShow,
  onEdit,
}: {
  books: Book[]
  authors: Author[]
  T: Theme
  onShow: (id: number) => void
  onEdit: (id: number) => void
}) {
  const thCell: React.CSSProperties = {
    padding: "8px 12px",
    fontWeight: 500,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: T.muted,
    borderBottom: `1px solid ${T.border}`,
    textAlign: "left",
    backgroundColor: T.rowAlt,
  }
  const tdCell: React.CSSProperties = {
    padding: "9px 12px",
    fontSize: 13,
    borderBottom: `1px solid ${T.border}`,
    color: T.text,
  }
  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        backgroundColor: T.card,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thCell}>Title</th>
            <th style={thCell}>Author</th>
            <th style={thCell}>Genre</th>
            <th style={{ ...thCell, textAlign: "right" }}>Price</th>
            <th style={{ ...thCell, textAlign: "right" }}>Stock</th>
            <th style={{ ...thCell, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, i) => {
            const author = authors.find((a) => a.id === book.authorId)
            return (
              <tr
                key={book.id}
                style={{ backgroundColor: i % 2 === 0 ? T.row : T.rowAlt }}
              >
                <td style={{ ...tdCell, fontWeight: 500 }}>{book.title}</td>
                <td style={{ ...tdCell, color: T.muted }}>{author?.name}</td>
                <td style={tdCell}>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 7px",
                      borderRadius: 4,
                      border: `1px solid ${T.border}`,
                      color: T.muted,
                    }}
                  >
                    {book.genre}
                  </span>
                </td>
                <td style={{ ...tdCell, textAlign: "right" }}>
                  ${book.price.toFixed(2)}
                </td>
                <td style={{ ...tdCell, textAlign: "right" }}>{book.stock}</td>
                <td style={{ ...tdCell, textAlign: "right" }}>
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    <Button variant="outline" size="icon-sm" onClick={() => onShow(book.id)} aria-label="View book">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </Button>
                    <Button variant="outline" size="icon-sm" onClick={() => onEdit(book.id)} aria-label="Edit book">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Button>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function BookShow({
  book,
  authors,
  T,
  onEdit,
  onDelete,
}: {
  book: Book
  authors: Author[]
  T: Theme
  onEdit: () => void
  onDelete: () => void
}) {
  const author = authors.find((a) => a.id === book.authorId)
  return (
    <div
      style={{
        backgroundColor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: T.text }}>
            {book.title}
          </div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>
            by {author?.name}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
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
            style={{
              padding: 12,
              backgroundColor: T.rowAlt,
              borderRadius: 6,
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: T.muted,
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BookForm({
  T,
  data,
  onChange,
  onSave,
  onCancel,
  isCreate,
  authors,
}: {
  T: Theme
  data: Record<string, string>
  onChange: (key: string, value: string) => void
  onSave: () => void
  onCancel: () => void
  isCreate: boolean
  authors: Author[]
}) {
  const genres = ["Fiction", "Self-Help", "Sci-Fi", "Mystery", "Biography", "History", "Romance", "Thriller", "Fantasy"]
  const textFields = [
    { key: "price", label: "Price ($)", placeholder: "14.99" },
    { key: "year", label: "Year", placeholder: "2024" },
    { key: "stock", label: "Stock", placeholder: "0" },
  ]
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: T.muted,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
  }
  return (
    <div
      style={{
        backgroundColor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: T.text,
          marginBottom: 16,
        }}
      >
        {isCreate ? "New Book" : "Edit Book"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {/* Author dropdown */}
        <div>
          <span style={labelStyle}>Author</span>
          <select
            value={data["authorId"] ?? ""}
            onChange={(e) => onChange("authorId", e.target.value)}
            style={{ ...fieldStyle(T), appearance: "auto" }}
          >
            <option value="">Select an author…</option>
            {authors.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        {/* Genre dropdown */}
        <div>
          <span style={labelStyle}>Genre</span>
          <select
            value={data["genre"] ?? ""}
            onChange={(e) => onChange("genre", e.target.value)}
            style={{ ...fieldStyle(T), appearance: "auto" }}
          >
            <option value="">Select a genre…</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        {/* Title - full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <span style={labelStyle}>Title</span>
          <input
            value={data["title"] ?? ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Book title"
            style={fieldStyle(T)}
          />
        </div>
        {textFields.map((f) => (
          <div key={f.key}>
            <span style={labelStyle}>{f.label}</span>
            <input
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={fieldStyle(T)}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSave}>{isCreate ? "Create book" : "Save changes"}</Button>
      </div>
    </div>
  )
}

function AuthorsList({
  authors,
  T,
  onShow,
  onEdit,
}: {
  authors: Author[]
  T: Theme
  onShow: (id: number) => void
  onEdit: (id: number) => void
}) {
  const thCell: React.CSSProperties = {
    padding: "8px 12px",
    fontWeight: 500,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: T.muted,
    borderBottom: `1px solid ${T.border}`,
    textAlign: "left",
    backgroundColor: T.rowAlt,
  }
  const tdCell: React.CSSProperties = {
    padding: "9px 12px",
    fontSize: 13,
    borderBottom: `1px solid ${T.border}`,
    color: T.text,
  }
  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        backgroundColor: T.card,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thCell}>Name</th>
            <th style={thCell}>Nationality</th>
            <th style={thCell}>Bio</th>
            <th style={{ ...thCell, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author, i) => (
            <tr
              key={author.id}
              style={{ backgroundColor: i % 2 === 0 ? T.row : T.rowAlt }}
            >
              <td style={{ ...tdCell, fontWeight: 500 }}>{author.name}</td>
              <td style={{ ...tdCell, color: T.muted }}>{author.nationality}</td>
              <td
                style={{
                  ...tdCell,
                  color: T.muted,
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {author.bio}
              </td>
              <td style={{ ...tdCell, textAlign: "right" }}>
                <span style={{ display: "inline-flex", gap: 4 }}>
                  <Button variant="outline" size="icon-sm" onClick={() => onShow(author.id)} aria-label="View author">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </Button>
                  <Button variant="outline" size="icon-sm" onClick={() => onEdit(author.id)} aria-label="Edit author">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AuthorShow({
  author,
  books,
  T,
  onEdit,
  onDelete,
}: {
  author: Author
  books: Book[]
  T: Theme
  onEdit: () => void
  onDelete: () => void
}) {
  const authorBooks = books.filter((b) => b.authorId === author.id)
  return (
    <div
      style={{
        backgroundColor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: T.text }}>
            {author.name}
          </div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>
            {author.nationality}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>

      <div
        style={{
          padding: 14,
          backgroundColor: T.rowAlt,
          borderRadius: 6,
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: T.muted,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          Biography
        </div>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>
          {author.bio}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 10,
            color: T.muted,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          Books ({authorBooks.length})
        </div>
        {authorBooks.length === 0 ? (
          <div style={{ fontSize: 13, color: T.muted }}>No books on record.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {authorBooks.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  backgroundColor: T.rowAlt,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>
                    {b.genre} · {b.year}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: T.muted }}>
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

function AuthorForm({
  T,
  data,
  onChange,
  onSave,
  onCancel,
  isCreate,
}: {
  T: Theme
  data: Record<string, string>
  onChange: (key: string, value: string) => void
  onSave: () => void
  onCancel: () => void
  isCreate: boolean
}) {
  return (
    <div
      style={{
        backgroundColor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: T.text,
          marginBottom: 16,
        }}
      >
        {isCreate ? "New Author" : "Edit Author"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { key: "name", label: "Name", placeholder: "Full name" },
          {
            key: "nationality",
            label: "Nationality",
            placeholder: "e.g. British",
          },
        ].map((f) => (
          <div key={f.key}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: T.muted,
                marginBottom: 5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {f.label}
            </div>
            <input
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={fieldStyle(T)}
            />
          </div>
        ))}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: T.muted,
              marginBottom: 5,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Biography
          </div>
          <textarea
            value={data["bio"] ?? ""}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Short biography…"
            rows={3}
            style={{ ...fieldStyle(T), resize: "vertical" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSave}>{isCreate ? "Create author" : "Save changes"}</Button>
      </div>
    </div>
  )
}

// --- Main component ------------------------------------------------------

function BookstoreAdmin() {
  const [isDark, setIsDark] = useState(false)
  const [section, setSection] = useState<Section>("books")
  const [view, setView] = useState<View>("list")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS)
  const [authors, setAuthors] = useState<Author[]>(INITIAL_AUTHORS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [nextId, setNextId] = useState(6)

  const T = isDark ? DARK : LIGHT

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const switchSection = (s: Section) => {
    setSection(s)
    setView("list")
    setSelectedId(null)
  }

  const openShow = (id: number) => {
    setView("show")
    setSelectedId(id)
  }

  const openEdit = (id: number) => {
    setView("edit")
    setSelectedId(id)
    if (section === "books") {
      const b = books.find((x) => x.id === id)!
      setFormData({
        title: b.title,
        authorId: String(b.authorId),
        genre: b.genre,
        price: String(b.price),
        year: String(b.year),
        stock: String(b.stock),
      })
    } else {
      const a = authors.find((x) => x.id === id)!
      setFormData({ name: a.name, nationality: a.nationality, bio: a.bio })
    }
  }

  const openCreate = () => {
    setView("create")
    setSelectedId(null)
    setFormData({})
  }

  const saveBook = () => {
    if (view === "create") {
      const authorId = parseInt(formData["authorId"] ?? "1") || 1
      setBooks((prev) => [
        ...prev,
        {
          id: nextId,
          title: formData["title"] || "Untitled",
          authorId,
          genre: formData["genre"] || "Fiction",
          price: parseFloat(formData["price"] ?? "0") || 0,
          year: parseInt(formData["year"] ?? "2024") || 2024,
          stock: parseInt(formData["stock"] ?? "0") || 0,
        },
      ])
      setNextId((n) => n + 1)
      showToast("Book created successfully")
    } else {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === selectedId
            ? {
                ...b,
                title: formData["title"] || b.title,
                authorId: parseInt(formData["authorId"] ?? "0") || b.authorId,
                genre: formData["genre"] || b.genre,
                price: parseFloat(formData["price"] ?? "0") || b.price,
                year: parseInt(formData["year"] ?? "0") || b.year,
                stock: parseInt(formData["stock"] ?? "0") || b.stock,
              }
            : b,
        ),
      )
      showToast("Book updated successfully")
    }
    setView("list")
  }

  const deleteBook = (id: number) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
    showToast("Book deleted")
    setView("list")
  }

  const saveAuthor = () => {
    if (view === "create") {
      setAuthors((prev) => [
        ...prev,
        {
          id: nextId,
          name: formData["name"] || "New Author",
          nationality: formData["nationality"] || "Unknown",
          bio: formData["bio"] || "",
        },
      ])
      setNextId((n) => n + 1)
      showToast("Author created successfully")
    } else {
      setAuthors((prev) =>
        prev.map((a) =>
          a.id === selectedId
            ? {
                ...a,
                name: formData["name"] || a.name,
                nationality: formData["nationality"] || a.nationality,
                bio: formData["bio"] || a.bio,
              }
            : a,
        ),
      )
      showToast("Author updated successfully")
    }
    setView("list")
  }

  const deleteAuthor = (id: number) => {
    setAuthors((prev) => prev.filter((a) => a.id !== id))
    showToast("Author deleted")
    setView("list")
  }

  const selectedBook = books.find((b) => b.id === selectedId)
  const selectedAuthor = authors.find((a) => a.id === selectedId)

  const sectionLabel =
    section === "books"
      ? view === "create"
        ? "New Book"
        : view === "edit"
          ? "Edit Book"
          : view === "show"
            ? "Book Details"
            : "Books"
      : view === "create"
        ? "New Author"
        : view === "edit"
          ? "Edit Author"
          : view === "show"
            ? "Author Details"
            : "Authors"

  const renderContent = () => {
    if (section === "books") {
      if (view === "list")
        return (
          <BooksList
            books={books}
            authors={authors}
            T={T}
            onShow={openShow}
            onEdit={openEdit}
          />
        )
      if (view === "show" && selectedBook)
        return (
          <BookShow
            book={selectedBook}
            authors={authors}
            T={T}
            onEdit={() => openEdit(selectedBook.id)}
            onDelete={() => deleteBook(selectedBook.id)}
          />
        )
      if (view === "edit" || view === "create")
        return (
          <BookForm
            T={T}
            data={formData}
            onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
            onSave={saveBook}
            onCancel={() => setView(view === "create" ? "list" : "show")}
            isCreate={view === "create"}
            authors={authors}
          />
        )
    } else {
      if (view === "list")
        return (
          <AuthorsList
            authors={authors}
            T={T}
            onShow={openShow}
            onEdit={openEdit}
          />
        )
      if (view === "show" && selectedAuthor)
        return (
          <AuthorShow
            author={selectedAuthor}
            books={books}
            T={T}
            onEdit={() => openEdit(selectedAuthor.id)}
            onDelete={() => deleteAuthor(selectedAuthor.id)}
          />
        )
      if (view === "edit" || view === "create")
        return (
          <AuthorForm
            T={T}
            data={formData}
            onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
            onSave={saveAuthor}
            onCancel={() => setView(view === "create" ? "list" : "show")}
            isCreate={view === "create"}
          />
        )
    }
    return null
  }

  return (
    <div
      className={`-m-4 w-[calc(100%+2rem)] overflow-hidden rounded-lg${isDark ? " dark" : ""}`}
      style={{
        backgroundColor: T.root,
        color: T.text,
        minHeight: 420,
        display: "flex",
        position: "relative",
      }}
    >
      {/* Toast notifications — anchored at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 8,
          pointerEvents: "none",
          alignItems: "center",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${T.toastBorder}`,
              backgroundColor: T.toastBg,
              color: T.toastText,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: T.toastShadow,
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: 220,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "white",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: 148,
          flexShrink: 0,
          backgroundColor: T.sidebar,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{ fontSize: 13, fontWeight: 700, color: T.text, display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.activeSidebarText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Bookstore
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "8px 0", flex: 1 }}>
          {(["books", "authors"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => switchSection(s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                width: "100%",
                fontSize: 13,
                fontWeight: section === s ? 600 : 400,
                color: section === s ? T.activeSidebarText : T.muted,
                backgroundColor:
                  section === s ? T.activeSidebar : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {s === "books" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              )}
              <span style={{ textTransform: "capitalize" }}>{s}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* App bar */}
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            backgroundColor: T.appbar,
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </Button>
            {/* User avatar */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "#4f46e5",
                color: "white",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.05em",
              }}
            >
              AD
            </div>
          </div>
        </div>

        {/* Content header / breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: `1px solid ${T.border}`,
            backgroundColor: T.root,
            flexShrink: 0,
          }}
        >
          <div
            style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}
          >
            {view !== "list" && (
              <>
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => setView("list")}
                  className="h-auto p-0 text-xs"
                  style={{ color: T.activeSidebarText }}
                >
                  {section === "books" ? "Books" : "Authors"}
                </Button>
                <span style={{ color: T.muted }}>/</span>
              </>
            )}
            <span style={{ color: T.text, fontWeight: 500 }}>
              {sectionLabel}
            </span>
          </div>
          {view === "list" && (
            <Button size="sm" onClick={openCreate}>
              + New {section === "books" ? "Book" : "Author"}
            </Button>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            backgroundColor: T.root,
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
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
    "The toast component doesn't adapt properly to dark mode, leaving confirmation messages unreadable.",
    "Notification messages are not visible in dark mode due to insufficient contrast between text color and background color.",
    "The app feedback toasts are readable in light mode but invisible in dark mode because the text color is too close to the background.",
  ],
  wrongAnswers: [
    "The delete button is not styled differently from other actions, making it hard to identify as destructive.",
    "There is no confirmation dialog before deleting a book or author.",
    "The sidebar does not show how many items are in each section.",
    "The theme toggle doesn't persist the preference after a page refresh.",
    "Form fields don't validate required input before submission.",
    "The table lacks sorting and filtering capabilities.",
  ],
}
