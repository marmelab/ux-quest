import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
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
  { id: 1, name: "Matt Haig", nationality: "British", bio: "Bestselling author of The Midnight Library and Reasons to Stay Alive." },
  { id: 2, name: "James Clear", nationality: "American", bio: "Author and speaker on habits, decision-making, and self-improvement." },
  { id: 3, name: "Andy Weir", nationality: "American", bio: "Science fiction writer best known for The Martian and Project Hail Mary." },
  { id: 4, name: "Richard Osman", nationality: "British", bio: "Television presenter and novelist, creator of The Thursday Murder Club." },
  { id: 5, name: "Gabrielle Zevin", nationality: "American", bio: "Novelist and screenwriter, author of Tomorrow, and Tomorrow, and Tomorrow." },
]

const INITIAL_BOOKS: Book[] = [
  { id: 1, title: "The Midnight Library", authorId: 1, genre: "Fiction", price: 14.99, year: 2020, stock: 42 },
  { id: 2, title: "Atomic Habits", authorId: 2, genre: "Self-Help", price: 16.99, year: 2018, stock: 87 },
  { id: 3, title: "Project Hail Mary", authorId: 3, genre: "Sci-Fi", price: 15.99, year: 2021, stock: 31 },
  { id: 4, title: "The Thursday Murder Club", authorId: 4, genre: "Mystery", price: 13.99, year: 2020, stock: 19 },
  { id: 5, title: "Tomorrow, and Tomorrow, and Tomorrow", authorId: 5, genre: "Fiction", price: 17.99, year: 2022, stock: 55 },
]

// --- Shared class strings ------------------------------------------------

const labelCls = "text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide block"
const fieldCls = "w-full px-2.5 py-[7px] text-[13px] rounded-md border border-zinc-200 dark:border-neutral-800 bg-gray-100 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-200 outline-none font-[inherit] box-border"
const cardCls = "bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-neutral-800 rounded-lg p-5"
const mutedCls = "text-gray-500 dark:text-gray-400"
const textCls = "text-gray-900 dark:text-gray-200"
const detailLabel = "text-[10px] text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-[0.06em] font-medium"
const detailBox = "bg-zinc-50 dark:bg-[#1f1f1f] border border-zinc-200 dark:border-neutral-800 rounded-md"

const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)

// --- Sub-components ------------------------------------------------------

function BooksList({ books, authors, onShow, onEdit }: { books: Book[]; authors: Author[]; onShow: (id: number) => void; onEdit: (id: number) => void }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="text-[13px] table-fixed [&_th]:px-2 [&_th]:py-1.5 [&_th]:h-auto [&_th]:whitespace-normal [&_td]:px-2 [&_td]:py-2 [&_td]:whitespace-normal">
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
                  <span className={`text-[11px] px-[7px] py-0.5 rounded border border-zinc-200 dark:border-neutral-800 ${mutedCls}`}>{book.genre}</span>
                </TableCell>
                <TableCell className="text-right">${book.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{book.stock}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex gap-1">
                    <Button variant="outline" size="icon-sm" onClick={() => onShow(book.id)} aria-label="View book"><EyeIcon /></Button>
                    <Button variant="outline" size="icon-sm" onClick={() => onEdit(book.id)} aria-label="Edit book"><EditIcon /></Button>
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

function BookShow({ book, authors, onEdit, onDelete }: { book: Book; authors: Author[]; onEdit: () => void; onDelete: () => void }) {
  const author = authors.find((a) => a.id === book.authorId)
  return (
    <div className={cardCls}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className={`text-[17px] font-semibold ${textCls}`}>{book.title}</div>
          <div className={`text-[13px] ${mutedCls} mt-0.5`}>by {author?.name}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {([["Genre", book.genre], ["Price", `$${book.price.toFixed(2)}`], ["Published", book.year], ["Stock", `${book.stock} copies`]] as [string, string | number][]).map(([label, value]) => (
          <div key={label} className={`p-3 ${detailBox}`}>
            <div className={detailLabel}>{label}</div>
            <div className={`text-sm font-medium ${textCls}`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BookForm({ data, onChange, onSave, onCancel, isCreate, authors }: { data: Record<string, string>; onChange: (key: string, value: string) => void; onSave: () => void; onCancel: () => void; isCreate: boolean; authors: Author[] }) {
  const genres = ["Fiction", "Self-Help", "Sci-Fi", "Mystery", "Biography", "History", "Romance", "Thriller", "Fantasy"]
  return (
    <div className={cardCls}>
      <div className={`text-sm font-semibold ${textCls} mb-4`}>{isCreate ? "New Book" : "Edit Book"}</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={labelCls}>Author</span>
          <select value={data["authorId"] ?? ""} onChange={(e) => onChange("authorId", e.target.value)} className={`${fieldCls} appearance-auto`}>
            <option value="">Select an author…</option>
            {authors.map((a) => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <span className={labelCls}>Genre</span>
          <select value={data["genre"] ?? ""} onChange={(e) => onChange("genre", e.target.value)} className={`${fieldCls} appearance-auto`}>
            <option value="">Select a genre…</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="col-span-full">
          <span className={labelCls}>Title</span>
          <input value={data["title"] ?? ""} onChange={(e) => onChange("title", e.target.value)} placeholder="Book title" className={fieldCls} />
        </div>
        {[
          { key: "price", label: "Price ($)", placeholder: "14.99" },
          { key: "year", label: "Year", placeholder: "2024" },
          { key: "stock", label: "Stock", placeholder: "0" },
        ].map((f) => (
          <div key={f.key}>
            <span className={labelCls}>{f.label}</span>
            <input value={data[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)} placeholder={f.placeholder} className={fieldCls} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSave}>{isCreate ? "Create book" : "Save changes"}</Button>
      </div>
    </div>
  )
}

function AuthorsList({ authors, onShow, onEdit }: { authors: Author[]; onShow: (id: number) => void; onEdit: (id: number) => void }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="text-[13px] table-fixed [&_th]:px-2 [&_th]:py-1.5 [&_th]:h-auto [&_th]:whitespace-normal [&_td]:px-2 [&_td]:py-2 [&_td]:whitespace-normal">
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
              <TableCell className={`${mutedCls} overflow-hidden text-ellipsis`}>{author.bio}</TableCell>
              <TableCell className="text-right">
                <span className="inline-flex gap-1">
                  <Button variant="outline" size="icon-sm" onClick={() => onShow(author.id)} aria-label="View author"><EyeIcon /></Button>
                  <Button variant="outline" size="icon-sm" onClick={() => onEdit(author.id)} aria-label="Edit author"><EditIcon /></Button>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AuthorShow({ author, books, onEdit, onDelete }: { author: Author; books: Book[]; onEdit: () => void; onDelete: () => void }) {
  const authorBooks = books.filter((b) => b.authorId === author.id)
  return (
    <div className={`${cardCls} flex flex-col gap-3.5`}>
      <div className="flex justify-between items-start">
        <div>
          <div className={`text-[17px] font-semibold ${textCls}`}>{author.name}</div>
          <div className={`text-[13px] ${mutedCls} mt-0.5`}>{author.nationality}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      <div className={`p-3.5 ${detailBox}`}>
        <div className={`${detailLabel} mb-1.5`}>Biography</div>
        <div className={`text-[13px] ${textCls} leading-relaxed`}>{author.bio}</div>
      </div>
      <div>
        <div className={`${detailLabel} mb-2`}>Books ({authorBooks.length})</div>
        {authorBooks.length === 0 ? (
          <div className={`text-[13px] ${mutedCls}`}>No books on record.</div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {authorBooks.map((b) => (
              <div key={b.id} className={`flex items-center justify-between px-3 py-2 ${detailBox}`}>
                <div>
                  <div className={`text-[13px] font-medium ${textCls}`}>{b.title}</div>
                  <div className={`text-[11px] ${mutedCls} mt-px`}>{b.genre} · {b.year}</div>
                </div>
                <div className={`text-[13px] ${mutedCls}`}>${b.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AuthorForm({ data, onChange, onSave, onCancel, isCreate }: { data: Record<string, string>; onChange: (key: string, value: string) => void; onSave: () => void; onCancel: () => void; isCreate: boolean }) {
  return (
    <div className={cardCls}>
      <div className={`text-sm font-semibold ${textCls} mb-4`}>{isCreate ? "New Author" : "Edit Author"}</div>
      <div className="flex flex-col gap-3">
        {[
          { key: "name", label: "Name", placeholder: "Full name" },
          { key: "nationality", label: "Nationality", placeholder: "e.g. British" },
        ].map((f) => (
          <div key={f.key}>
            <div className={labelCls}>{f.label}</div>
            <input value={data[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)} placeholder={f.placeholder} className={fieldCls} />
          </div>
        ))}
        <div>
          <div className={labelCls}>Biography</div>
          <textarea value={data["bio"] ?? ""} onChange={(e) => onChange("bio", e.target.value)} placeholder="Short biography…" rows={3} className={`${fieldCls} resize-y`} />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
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

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const switchSection = (s: Section) => { setSection(s); setView("list"); setSelectedId(null) }
  const openShow = (id: number) => { setView("show"); setSelectedId(id) }

  const openEdit = (id: number) => {
    setView("edit")
    setSelectedId(id)
    if (section === "books") {
      const b = books.find((x) => x.id === id)!
      setFormData({ title: b.title, authorId: String(b.authorId), genre: b.genre, price: String(b.price), year: String(b.year), stock: String(b.stock) })
    } else {
      const a = authors.find((x) => x.id === id)!
      setFormData({ name: a.name, nationality: a.nationality, bio: a.bio })
    }
  }

  const openCreate = () => { setView("create"); setSelectedId(null); setFormData({}) }

  const saveBook = () => {
    if (view === "create") {
      setBooks((prev) => [...prev, {
        id: nextId, title: formData["title"] || "Untitled", authorId: parseInt(formData["authorId"] ?? "1") || 1,
        genre: formData["genre"] || "Fiction", price: parseFloat(formData["price"] ?? "0") || 0,
        year: parseInt(formData["year"] ?? "2024") || 2024, stock: parseInt(formData["stock"] ?? "0") || 0,
      }])
      setNextId((n) => n + 1)
      showToast("Book created successfully")
    } else {
      setBooks((prev) => prev.map((b) => b.id === selectedId ? {
        ...b, title: formData["title"] || b.title, authorId: parseInt(formData["authorId"] ?? "0") || b.authorId,
        genre: formData["genre"] || b.genre, price: parseFloat(formData["price"] ?? "0") || b.price,
        year: parseInt(formData["year"] ?? "0") || b.year, stock: parseInt(formData["stock"] ?? "0") || b.stock,
      } : b))
      showToast("Book updated successfully")
    }
    setView("list")
  }

  const deleteBook = (id: number) => { setBooks((prev) => prev.filter((b) => b.id !== id)); showToast("Book deleted"); setView("list") }

  const saveAuthor = () => {
    if (view === "create") {
      setAuthors((prev) => [...prev, { id: nextId, name: formData["name"] || "New Author", nationality: formData["nationality"] || "Unknown", bio: formData["bio"] || "" }])
      setNextId((n) => n + 1)
      showToast("Author created successfully")
    } else {
      setAuthors((prev) => prev.map((a) => a.id === selectedId ? { ...a, name: formData["name"] || a.name, nationality: formData["nationality"] || a.nationality, bio: formData["bio"] || a.bio } : a))
      showToast("Author updated successfully")
    }
    setView("list")
  }

  const deleteAuthor = (id: number) => { setAuthors((prev) => prev.filter((a) => a.id !== id)); showToast("Author deleted"); setView("list") }

  const selectedBook = books.find((b) => b.id === selectedId)
  const selectedAuthor = authors.find((a) => a.id === selectedId)

  const sectionLabel = section === "books"
    ? view === "create" ? "New Book" : view === "edit" ? "Edit Book" : view === "show" ? "Book Details" : "Books"
    : view === "create" ? "New Author" : view === "edit" ? "Edit Author" : view === "show" ? "Author Details" : "Authors"

  const renderContent = () => {
    if (section === "books") {
      if (view === "list") return <BooksList books={books} authors={authors} onShow={openShow} onEdit={openEdit} />
      if (view === "show" && selectedBook) return <BookShow book={selectedBook} authors={authors} onEdit={() => openEdit(selectedBook.id)} onDelete={() => deleteBook(selectedBook.id)} />
      if (view === "edit" || view === "create") return <BookForm data={formData} onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))} onSave={saveBook} onCancel={() => setView(view === "create" ? "list" : "show")} isCreate={view === "create"} authors={authors} />
    } else {
      if (view === "list") return <AuthorsList authors={authors} onShow={openShow} onEdit={openEdit} />
      if (view === "show" && selectedAuthor) return <AuthorShow author={selectedAuthor} books={books} onEdit={() => openEdit(selectedAuthor.id)} onDelete={() => deleteAuthor(selectedAuthor.id)} />
      if (view === "edit" || view === "create") return <AuthorForm data={formData} onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))} onSave={saveAuthor} onCancel={() => setView(view === "create" ? "list" : "show")} isCreate={view === "create"} />
    }
    return null
  }

  return (
    <div className={`-m-4 w-[calc(100%+2rem)]${isDark ? " dark" : ""}`}>
    <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-200 min-h-[420px] flex relative">
      {/* Toast notifications — BUG: dark mode toast has ~1.3:1 contrast ratio (bg #1e1e1e, text #353535) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 pointer-events-none items-center">
        {toasts.map((toast) => (
          <div key={toast.id} className="px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-[#252525] bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-[#353535] text-[13px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center gap-2 min-w-[220px]">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white shrink-0">✓</span>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="w-[120px] shrink-0 bg-white dark:bg-[#111] border-r border-zinc-200 dark:border-neutral-800 flex flex-col">
        <div className="px-4 py-3.5 border-b border-zinc-200 dark:border-neutral-800">
          <div className={`text-[13px] font-bold ${textCls} flex items-center gap-1.5`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-indigo-400">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Bookstore
          </div>
          <div className={`text-[10px] ${mutedCls} mt-0.5`}>Admin Panel</div>
        </div>
        <nav className="py-2 flex-1">
          {(["books", "authors"] as Section[]).map((s) => (
            <button key={s} onClick={() => switchSection(s)} className={`flex items-center gap-2 px-4 py-2 w-full text-[13px] border-none cursor-pointer text-left ${section === s ? "font-semibold text-blue-600 dark:text-indigo-400 bg-blue-50 dark:bg-[#1e2640]" : `font-normal ${mutedCls} bg-transparent`}`}>
              {s === "books" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
              <span className="capitalize">{s}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* App bar */}
        <div className="h-12 flex items-center justify-between px-4 bg-white dark:bg-[#111] border-b border-zinc-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5 ml-auto">
            <Button variant="ghost" size="icon-sm" onClick={() => setIsDark((d) => !d)} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </Button>
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center tracking-wide">AD</div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-neutral-800 bg-gray-100 dark:bg-[#0d0d0d] shrink-0">
          <div className={`text-xs ${mutedCls} flex items-center gap-1`}>
            {view !== "list" && (
              <>
                <Button variant="link" size="xs" onClick={() => setView("list")} className="h-auto p-0 text-xs text-blue-600 dark:text-indigo-400">
                  {section === "books" ? "Books" : "Authors"}
                </Button>
                <span>/</span>
              </>
            )}
            <span className={`${textCls} font-medium`}>{sectionLabel}</span>
          </div>
          {view === "list" && <Button size="sm" onClick={openCreate}>+ New {section === "books" ? "Book" : "Author"}</Button>}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-[#0d0d0d]">
          {renderContent()}
        </div>
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
