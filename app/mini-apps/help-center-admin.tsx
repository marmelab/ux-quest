import { createContext, useContext, useState } from "react"
import {
  BookOpenIcon,
  EyeIcon,
  FileTextIcon,
  FolderOpenIcon,
  PlusIcon,
  SquarePenIcon,
  TagIcon,
  Trash2Icon,
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
import { Badge } from "~/components/ui/badge"
import type { MiniAppDefinition } from "~/lib/types"

// --- Types ----------------------------------------------------------------

interface Article {
  id: number
  title: string
  categoryId: number | null
  status: "published" | "draft"
  excerpt: string
  content: string
  updatedAt: string
  views: number
}

interface Category {
  id: number
  name: string
  slug: string
  articleCount: number
  description: string
}

type Section = "articles" | "categories"

interface Toast {
  id: number
  message: string
}

// --- Mock data ------------------------------------------------------------

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Getting Started",
    slug: "getting-started",
    articleCount: 3,
    description: "Onboarding guides and initial setup documentation.",
  },
  {
    id: 2,
    name: "Account & Billing",
    slug: "account-billing",
    articleCount: 2,
    description: "Plans, invoices, and payment information.",
  },
  {
    id: 3,
    name: "Security",
    slug: "security",
    articleCount: 2,
    description: "Authentication, SSO, and access control.",
  },
  {
    id: 4,
    name: "API Reference",
    slug: "api-reference",
    articleCount: 2,
    description: "REST API endpoints and integration guides.",
  },
]

const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Welcome to Acme Cloud",
    categoryId: 1,
    status: "published",
    excerpt: "Learn the basics of your new workspace and get up to speed.",
    content:
      "This guide walks you through the initial setup of your workspace, including inviting team members, configuring your first project, and understanding the dashboard layout.",
    updatedAt: "Mar 12, 2026",
    views: 2847,
  },
  {
    id: 2,
    title: "Quick Setup Guide",
    categoryId: 1,
    status: "published",
    excerpt: "Configure your account and start collaborating in minutes.",
    content:
      "Follow these steps to set up your Acme Cloud account: verify your email, choose a workspace name, invite your team, create your first project, and set up integrations.",
    updatedAt: "Feb 28, 2026",
    views: 1923,
  },
  {
    id: 3,
    title: "System Requirements",
    categoryId: 1,
    status: "draft",
    excerpt: "Minimum and recommended specs for the desktop app.",
    content:
      "Acme Cloud runs on Windows 10+, macOS 12+, and Ubuntu 20.04+. Minimum: 4 GB RAM, 2 GHz dual-core. Recommended: 8 GB RAM, modern quad-core, SSD storage.",
    updatedAt: "Jan 15, 2026",
    views: 892,
  },
  {
    id: 4,
    title: "Plans & Pricing",
    categoryId: 2,
    status: "published",
    excerpt: "Compare features across Free, Pro, and Enterprise plans.",
    content:
      "Free: up to 3 users, 5 GB storage. Pro: $12/user/month, unlimited users, 100 GB. Enterprise: custom pricing, SSO, audit logs, dedicated support.",
    updatedAt: "Mar 10, 2026",
    views: 4210,
  },
  {
    id: 5,
    title: "Managing Invoices",
    categoryId: 2,
    status: "published",
    excerpt: "View, download, and configure your billing documents.",
    content:
      "Access invoices from Settings > Billing > Invoice History. Each invoice can be downloaded as a PDF. Update billing email or PO number via Edit Billing Info.",
    updatedAt: "Feb 20, 2026",
    views: 1156,
  },
  {
    id: 6,
    title: "Two-Factor Authentication",
    categoryId: 3,
    status: "published",
    excerpt: "Add an extra layer of security to your account.",
    content:
      "Enable 2FA from Settings > Security. We support authenticator apps and SMS verification. You'll be prompted for a code on each new device sign-in.",
    updatedAt: "Mar 5, 2026",
    views: 3091,
  },
  {
    id: 7,
    title: "Single Sign-On (SSO)",
    categoryId: 3,
    status: "published",
    excerpt: "Set up SSO with your identity provider for seamless access.",
    content:
      "SSO is available on Enterprise plans. We support SAML 2.0 and OpenID Connect. Configure in Settings > Security > SSO with your IdP metadata URL.",
    updatedAt: "Feb 18, 2026",
    views: 1743,
  },
  {
    id: 8,
    title: "REST API Overview",
    categoryId: 4,
    status: "published",
    excerpt: "Authentication, rate limits, and base URL for the Acme API.",
    content:
      "Base URL: https://api.acmecloud.io/v2. Authenticate with Bearer tokens. Rate limit: 1000 req/min on Pro, 5000 on Enterprise. All responses are JSON.",
    updatedAt: "Mar 15, 2026",
    views: 5632,
  },
  {
    id: 9,
    title: "Webhooks Guide",
    categoryId: 4,
    status: "draft",
    excerpt: "Receive real-time event notifications via HTTP callbacks.",
    content:
      "Configure webhooks in Settings > Integrations > Webhooks. Events: project.created, member.invited, document.updated. Payloads are signed with HMAC-SHA256.",
    updatedAt: "Mar 1, 2026",
    views: 987,
  },
]

// --- Shared class strings -------------------------------------------------

const mutedCls = "text-gray-500 dark:text-gray-400"
const textCls = "text-gray-900 dark:text-gray-200"
const labelCls =
  "text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide block"
const fieldCls =
  "w-full px-2.5 py-[7px] text-[13px] rounded-md border border-zinc-200 dark:border-neutral-800 bg-gray-100 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-200 outline-none font-[inherit] box-border"
const cardCls =
  "bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-neutral-800 rounded-lg p-5"
const detailLabel =
  "text-[10px] text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-[0.06em] font-medium"
const detailBox =
  "bg-zinc-50 dark:bg-[#1f1f1f] border border-zinc-200 dark:border-neutral-800 rounded-md"

// --- Store context --------------------------------------------------------

interface StoreContext {
  basePath: string
  articles: Article[]
  categories: Category[]
  showToast: (message: string) => void
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  nextId: number
  setNextId: React.Dispatch<React.SetStateAction<number>>
}

const StoreCtx = createContext<StoreContext>(null!)
const useStore = () => useContext(StoreCtx)

// --- Route components: Articles -------------------------------------------

function ArticlesList() {
  const { basePath, articles, categories } = useStore()
  const nav = useNavigate()

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="table-fixed text-sm [&_td]:py-2 [&_td]:whitespace-normal [&_th]:h-auto [&_th]:py-1.5 [&_th]:whitespace-normal">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead className="w-[25%]">Category</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[20%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => {
              const cat = categories.find((c) => c.id === article.categoryId)
              return (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell className={mutedCls}>{cat?.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === "published"
                          ? "default"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() =>
                        nav(`${basePath}/articles/${article.id}`)
                      }
                      aria-label="View article"
                    >
                      <EyeIcon size={13} />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
    </div>
  )
}

function ArticleShow() {
  const { basePath, articles, categories, setArticles, showToast } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const article = articles.find((a) => a.id === Number(id))
  if (!article) return null
  const cat = categories.find((c) => c.id === article.categoryId)

  return (
    <div className={`${cardCls} flex flex-col gap-3.5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-[17px] font-semibold ${textCls}`}>
            {article.title}
          </div>
          <div className={`text-[13px] ${mutedCls} mt-0.5`}>
            {cat?.name} · Updated {article.updatedAt}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nav(`${basePath}/articles/${article.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setArticles((prev) => prev.filter((a) => a.id !== article.id))
              showToast("Article deleted")
              nav(`${basePath}/articles`)
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {(
          [
            ["Status", article.status],
            ["Views", article.views.toLocaleString()],
            ["Updated", article.updatedAt],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} className={`p-3 ${detailBox}`}>
            <div className={detailLabel}>{label}</div>
            <div className={`text-[13px] ${textCls} capitalize`}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className={`p-3.5 ${detailBox}`}>
        <div className={`${detailLabel} mb-1.5`}>Excerpt</div>
        <div className={`text-[13px] ${textCls} leading-relaxed`}>
          {article.excerpt}
        </div>
      </div>
      <div className={`p-3.5 ${detailBox}`}>
        <div className={`${detailLabel} mb-1.5`}>Content</div>
        <div className={`text-[13px] ${textCls} leading-relaxed`}>
          {article.content}
        </div>
      </div>
    </div>
  )
}

function ArticleCreate() {
  const {
    basePath,
    setArticles,
    nextId,
    setNextId,
    showToast,
    categories,
  } = useStore()
  const nav = useNavigate()
  const [data, setData] = useState<Record<string, string>>({})
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))

  return (
    <form
      className={cardCls}
      onSubmit={(e) => {
        e.preventDefault()
        setArticles((prev) => [
          ...prev,
          {
            id: nextId,
            title: data["title"] || "Untitled",
            categoryId: parseInt(data["categoryId"] ?? "1") || 1,
            status: (data["status"] as Article["status"]) || "draft",
            excerpt: data["excerpt"] || "",
            content: data["content"] || "",
            updatedAt: "Mar 22, 2026",
            views: 0,
          },
        ])
        setNextId((n) => n + 1)
        showToast("Article created")
        nav(`${basePath}/articles`)
      }}
    >
      <div className={`text-sm font-semibold ${textCls} mb-4`}>
        New Article
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <span className={labelCls}>Title</span>
          <input
            value={data["title"] ?? ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Article title"
            className={fieldCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={labelCls}>Category</span>
            <select
              value={data["categoryId"] ?? ""}
              onChange={(e) => onChange("categoryId", e.target.value)}
              className={`${fieldCls} appearance-auto`}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelCls}>Status</span>
            <select
              value={data["status"] ?? "draft"}
              onChange={(e) => onChange("status", e.target.value)}
              className={`${fieldCls} appearance-auto`}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div>
          <span className={labelCls}>Excerpt</span>
          <input
            value={data["excerpt"] ?? ""}
            onChange={(e) => onChange("excerpt", e.target.value)}
            placeholder="Short summary…"
            className={fieldCls}
          />
        </div>
        <div>
          <span className={labelCls}>Content</span>
          <textarea
            value={data["content"] ?? ""}
            onChange={(e) => onChange("content", e.target.value)}
            placeholder="Article body…"
            rows={4}
            className={`${fieldCls} resize-y`}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => nav(`${basePath}/articles`)}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Create article
        </Button>
      </div>
    </form>
  )
}

function ArticleEdit() {
  const { basePath, articles, setArticles, showToast, categories } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const articleId = Number(id)
  const article = articles.find((a) => a.id === articleId)
  const [data, setData] = useState<Record<string, string>>(
    article
      ? {
          title: article.title,
          categoryId: String(article.categoryId),
          status: article.status,
          excerpt: article.excerpt,
          content: article.content,
        }
      : {},
  )
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))
  if (!article) return null

  return (
    <form
      className={cardCls}
      onSubmit={(e) => {
        e.preventDefault()
        setArticles((prev) =>
          prev.map((a) =>
            a.id === articleId
              ? {
                  ...a,
                  title: data["title"] || a.title,
                  categoryId:
                    parseInt(data["categoryId"] ?? "0") || a.categoryId,
                  status: (data["status"] as Article["status"]) || a.status,
                  excerpt: data["excerpt"] || a.excerpt,
                  content: data["content"] || a.content,
                  updatedAt: "Mar 22, 2026",
                }
              : a,
          ),
        )
        showToast("Article updated")
        nav(`${basePath}/articles`)
      }}
    >
      <div className={`text-sm font-semibold ${textCls} mb-4`}>
        Edit Article
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <span className={labelCls}>Title</span>
          <input
            value={data["title"] ?? ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Article title"
            className={fieldCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={labelCls}>Category</span>
            <select
              value={data["categoryId"] ?? ""}
              onChange={(e) => onChange("categoryId", e.target.value)}
              className={`${fieldCls} appearance-auto`}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelCls}>Status</span>
            <select
              value={data["status"] ?? "draft"}
              onChange={(e) => onChange("status", e.target.value)}
              className={`${fieldCls} appearance-auto`}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div>
          <span className={labelCls}>Excerpt</span>
          <input
            value={data["excerpt"] ?? ""}
            onChange={(e) => onChange("excerpt", e.target.value)}
            placeholder="Short summary…"
            className={fieldCls}
          />
        </div>
        <div>
          <span className={labelCls}>Content</span>
          <textarea
            value={data["content"] ?? ""}
            onChange={(e) => onChange("content", e.target.value)}
            placeholder="Article body…"
            rows={4}
            className={`${fieldCls} resize-y`}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => nav(`${basePath}/articles/${articleId}`)}
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

// --- Route components: Categories -----------------------------------------

function CategoriesList() {
  const { basePath, categories } = useStore()
  const nav = useNavigate()

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="table-fixed text-sm [&_td]:py-2 [&_td]:whitespace-normal [&_th]:h-auto [&_th]:py-1.5 [&_th]:whitespace-normal">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Name</TableHead>
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead className="w-[20%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell
                className={`${mutedCls} overflow-hidden text-ellipsis`}
              >
                {cat.description}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => nav(`${basePath}/categories/${cat.id}`)}
                  aria-label="View category"
                >
                  <EyeIcon size={13} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CategoryShow() {
  const { basePath, categories, articles, setArticles, setCategories, showToast } =
    useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const cat = categories.find((c) => c.id === Number(id))
  if (!cat) return null
  const catArticles = articles.filter((a) => a.categoryId === cat.id)

  return (
    <div className={`${cardCls} flex flex-col gap-3.5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-[17px] font-semibold ${textCls}`}>
            {cat.name}
          </div>
          <div className={`text-[13px] ${mutedCls} mt-0.5`}>/{cat.slug}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nav(`${basePath}/categories/${cat.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setArticles((prev) =>
                prev.map((a) =>
                  a.categoryId === cat.id ? { ...a, categoryId: null } : a,
                ),
              )
              setCategories((prev) => prev.filter((c) => c.id !== cat.id))
              showToast("Category deleted")
              nav(`${basePath}/categories`)
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={`p-3.5 ${detailBox}`}>
        <div className={`${detailLabel} mb-1.5`}>Description</div>
        <div className={`text-[13px] ${textCls} leading-relaxed`}>
          {cat.description}
        </div>
      </div>
      <div>
        <div className={`${detailLabel} mb-2`}>
          Articles ({catArticles.length})
        </div>
        {catArticles.length === 0 ? (
          <div className={`text-[13px] ${mutedCls}`}>
            No articles in this category.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {catArticles.map((a) => (
              <div
                key={a.id}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 ${detailBox} hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors`}
                onClick={() => nav(`${basePath}/articles/${a.id}`)}
              >
                <div>
                  <div className={`text-[13px] font-medium ${textCls}`}>
                    {a.title}
                  </div>
                  <div className={`text-[11px] ${mutedCls} mt-px`}>
                    {a.views.toLocaleString()} views
                  </div>
                </div>
                <Badge
                  variant={a.status === "published" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryCreate() {
  const { basePath, setCategories, nextId, setNextId, showToast } = useStore()
  const nav = useNavigate()
  const [data, setData] = useState<Record<string, string>>({})
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))

  return (
    <form
      className={cardCls}
      onSubmit={(e) => {
        e.preventDefault()
        setCategories((prev) => [
          ...prev,
          {
            id: nextId,
            name: data["name"] || "New Category",
            slug:
              data["slug"] ||
              (data["name"] || "new-category")
                .toLowerCase()
                .replace(/\s+/g, "-"),
            articleCount: 0,
            description: data["description"] || "",
          },
        ])
        setNextId((n) => n + 1)
        showToast("Category created")
        nav(`${basePath}/categories`)
      }}
    >
      <div className={`text-sm font-semibold ${textCls} mb-4`}>
        New Category
      </div>
      <div className="flex flex-col gap-3">
        {[
          { key: "name", label: "Name", placeholder: "Category name" },
          { key: "slug", label: "Slug", placeholder: "category-slug" },
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
          <div className={labelCls}>Description</div>
          <textarea
            value={data["description"] ?? ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="What this category covers…"
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
          onClick={() => nav(`${basePath}/categories`)}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Create category
        </Button>
      </div>
    </form>
  )
}

function CategoryEdit() {
  const { basePath, categories, setCategories, showToast } = useStore()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const catId = Number(id)
  const cat = categories.find((c) => c.id === catId)
  const [data, setData] = useState<Record<string, string>>(
    cat
      ? { name: cat.name, slug: cat.slug, description: cat.description }
      : {},
  )
  const onChange = (k: string, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }))
  if (!cat) return null

  return (
    <form
      className={cardCls}
      onSubmit={(e) => {
        e.preventDefault()
        setCategories((prev) =>
          prev.map((c) =>
            c.id === catId
              ? {
                  ...c,
                  name: data["name"] || c.name,
                  slug: data["slug"] || c.slug,
                  description: data["description"] || c.description,
                }
              : c,
          ),
        )
        showToast("Category updated")
        nav(`${basePath}/categories`)
      }}
    >
      <div className={`text-sm font-semibold ${textCls} mb-4`}>
        Edit Category
      </div>
      <div className="flex flex-col gap-3">
        {[
          { key: "name", label: "Name", placeholder: "Category name" },
          { key: "slug", label: "Slug", placeholder: "category-slug" },
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
          <div className={labelCls}>Description</div>
          <textarea
            value={data["description"] ?? ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="What this category covers…"
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
          onClick={() => nav(`${basePath}/categories/${catId}`)}
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

// --- Section layout with breadcrumb + Outlet ------------------------------

function SectionLayout({
  section,
  listLabel,
}: {
  section: Section
  listLabel: string
}) {
  const nav = useNavigate()
  const { "*": splat = "" } = useParams()
  const parts = splat.split("/").filter(Boolean)
  const { basePath, articles, categories } = useStore()
  const isList = parts.length === 0
  const isCreate = parts[0] === "new"
  const isEdit = parts[1] === "edit"

  // Build the current-page label
  let currentLabel = listLabel
  if (isCreate) {
    currentLabel = `New ${section === "articles" ? "Article" : "Category"}`
  } else if (isEdit) {
    const id = Number(parts[0])
    if (section === "articles") {
      const article = articles.find((a) => a.id === id)
      currentLabel = article ? `Edit: ${article.title}` : "Edit Article"
    } else {
      const cat = categories.find((c) => c.id === id)
      currentLabel = cat ? `Edit: ${cat.name}` : "Edit Category"
    }
  } else if (parts.length === 1 && parts[0] !== "new") {
    const id = Number(parts[0])
    if (section === "articles") {
      const article = articles.find((a) => a.id === id)
      currentLabel = article?.title ?? "Article"
    } else {
      const cat = categories.find((c) => c.id === id)
      currentLabel = cat?.name ?? "Category"
    }
  }

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-gray-100 px-4 py-2.5 dark:border-neutral-800 dark:bg-[#0d0d0d]">
        {/* BUG: All breadcrumb segments are styled identically — the current page
            label uses the same text color, weight, and cursor as the clickable
            ancestor links. Users cannot distinguish where they are from what
            they can click. A proper breadcrumb would visually differentiate the
            active item (e.g. darker text, no hover, default cursor). */}
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center gap-1.5 text-xs ${mutedCls}`}
        >
          <span
            className="cursor-pointer"
            onClick={() => nav(`${basePath}/${section}`)}
          >
            {listLabel}
          </span>
          {!isList && (
            <>
              <span>/</span>
              {isEdit && parts[0] !== "new" && (
                <>
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      nav(`${basePath}/${section}/${parts[0]}`)
                    }
                  >
                    {section === "articles"
                      ? (articles.find((a) => a.id === Number(parts[0]))
                          ?.title ?? "Article")
                      : (categories.find((c) => c.id === Number(parts[0]))
                          ?.name ?? "Category")}
                  </span>
                  <span>/</span>
                </>
              )}
              {/* Current page — styled identically to the clickable items above */}
              <span className="cursor-pointer">{currentLabel}</span>
            </>
          )}
        </nav>
        {isList && (
          <Button size="sm" onClick={() => nav(`${basePath}/${section}/new`)}>
            <PlusIcon size={14} className="mr-1" />
            New {section === "articles" ? "Article" : "Category"}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-2 dark:bg-[#0d0d0d]">
        <Outlet />
      </div>
    </>
  )
}

// --- Main component -------------------------------------------------------

function BreadcrumbNavApp() {
  const { "*": splat = "" } = useParams()
  const location = useLocation()
  const basePath = splat
    ? location.pathname.slice(0, -splat.length).replace(/\/$/, "")
    : location.pathname.replace(/\/$/, "")
  const section: Section = splat.startsWith("categories")
    ? "categories"
    : "articles"

  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextId, setNextId] = useState(10)

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    )
  }

  const nav = useNavigate()

  const store: StoreContext = {
    basePath,
    articles,
    categories,
    showToast,
    setArticles,
    setCategories,
    nextId,
    setNextId,
  }

  return (
    <StoreCtx.Provider value={store}>
      <div className="-m-6 w-[calc(100%+4rem)]">
        <div className="relative flex min-h-[420px] overflow-hidden rounded-lg bg-gray-100 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200">
          {/* Toasts */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col-reverse items-center gap-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="flex min-w-[220px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[13px] font-medium text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  ✓
                </span>
                {toast.message}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex w-[130px] shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#111]">
            <div className="border-b border-zinc-200 px-4 py-3.5 dark:border-neutral-800">
              <div
                className={`text-[13px] font-bold ${textCls} flex items-center gap-1.5`}
              >
                <BookOpenIcon
                  size={16}
                  className="text-blue-600 dark:text-indigo-400"
                />
                Acme Docs
              </div>
              <div className={`text-[10px] ${mutedCls} mt-0.5`}>
                Knowledge Base
              </div>
            </div>
            <nav className="flex-1 py-2">
              {(
                [
                  { key: "articles", icon: FileTextIcon, label: "Articles" },
                  { key: "categories", icon: TagIcon, label: "Categories" },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => nav(`${basePath}/${s.key}`)}
                  className={`flex w-full cursor-pointer items-center gap-2 border-none px-4 py-2 text-left text-[13px] ${
                    section === s.key
                      ? "bg-blue-50 font-semibold text-blue-600 dark:bg-[#1e2640] dark:text-indigo-400"
                      : `font-normal ${mutedCls} bg-transparent`
                  }`}
                >
                  <s.icon size={14} />
                  <span>{s.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main area */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* App bar */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-neutral-800 dark:bg-[#111]">
              <div className={`text-[13px] font-medium ${textCls}`}>
                Help Center Admin
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold tracking-wide text-white">
                JD
              </div>
            </div>

            {/* Routes */}
            <Routes>
              <Route index element={<Navigate to="articles" replace />} />
              <Route
                path="articles/*"
                element={
                  <SectionLayout section="articles" listLabel="Articles" />
                }
              >
                <Route index element={<ArticlesList />} />
                <Route path="new" element={<ArticleCreate />} />
                <Route path=":id" element={<ArticleShow />} />
                <Route path=":id/edit" element={<ArticleEdit />} />
              </Route>
              <Route
                path="categories/*"
                element={
                  <SectionLayout section="categories" listLabel="Categories" />
                }
              >
                <Route index element={<CategoriesList />} />
                <Route path="new" element={<CategoryCreate />} />
                <Route path=":id" element={<CategoryShow />} />
                <Route path=":id/edit" element={<CategoryEdit />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </StoreCtx.Provider>
  )
}

// --- Definition -----------------------------------------------------------

export const breadcrumbNav: MiniAppDefinition = {
  id: "help-center-admin",
  name: "Help Center Admin",
  introduction:
    "A knowledge base admin panel for managing help articles and categories, with multi-level navigation and breadcrumb trails.",
  category: "navigation",
  difficulty: "easy",
  component: BreadcrumbNavApp,
  expectedAnswers: [
    "The breadcrumb links and current page label are styled identically so you can't tell what's clickable",
    "There is no visual difference between clickable breadcrumb links and the current non-clickable page label",
    "All breadcrumb items look the same — same color, same cursor — making it impossible to tell where you are",
    "The current page in the breadcrumb has the same styling as the parent links, no visual distinction",
    "Breadcrumb navigation doesn't differentiate between clickable ancestor links and the active page",
    "Users can't tell which breadcrumb items are links because every segment looks identical",
    "The breadcrumbs don't indicate the current page — all items have the same text color and weight",
    "The active breadcrumb item is styled the same as clickable ones with no indication of current location",
  ],
  wrongAnswers: [
    "The search bar doesn't persist its query when navigating between pages",
    "The sidebar doesn't show article counts for each section",
    "There is no confirmation dialog before deleting an article or category",
    "The toast notification disappears too quickly to read",
    "Form fields don't validate required input before submission",
    "The table doesn't support sorting columns",
  ],
}
