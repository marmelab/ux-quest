import { BookOpenIcon, EyeIcon } from "lucide-react"
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
  category: string
  status: "published" | "draft"
  excerpt: string
  updatedAt: string
  views: number
}

// --- Mock data ------------------------------------------------------------

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Welcome to Acme Cloud",
    category: "Getting Started",
    status: "published",
    excerpt: "Learn the basics of your new workspace and get up to speed.",
    updatedAt: "Mar 12, 2026",
    views: 2847,
  },
  {
    id: 2,
    title: "Quick Setup Guide",
    category: "Getting Started",
    status: "published",
    excerpt: "Configure your account and start collaborating in minutes.",
    updatedAt: "Feb 28, 2026",
    views: 1923,
  },
  {
    id: 3,
    title: "System Requirements",
    category: "Getting Started",
    status: "draft",
    excerpt: "Minimum and recommended specs for the desktop app.",
    updatedAt: "Jan 15, 2026",
    views: 892,
  },
  {
    id: 4,
    title: "Plans & Pricing",
    category: "Account & Billing",
    status: "published",
    excerpt: "Compare features across Free, Pro, and Enterprise plans.",
    updatedAt: "Mar 10, 2026",
    views: 4210,
  },
  {
    id: 5,
    title: "Two-Factor Authentication",
    category: "Security",
    status: "published",
    excerpt: "Add an extra layer of security to your account.",
    updatedAt: "Mar 5, 2026",
    views: 3091,
  },
  {
    id: 6,
    title: "REST API Overview",
    category: "API Reference",
    status: "published",
    excerpt: "Authentication, rate limits, and base URL for the Acme API.",
    updatedAt: "Mar 15, 2026",
    views: 5632,
  },
]

// --- Shared class strings -------------------------------------------------

const mutedCls = "text-gray-500 dark:text-gray-400"
const textCls = "text-gray-900 dark:text-gray-200"
const detailLabel =
  "text-[10px] text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-[0.06em] font-medium"
const detailBox =
  "bg-zinc-50 dark:bg-[#1f1f1f] border border-zinc-200 dark:border-neutral-800 rounded-md"

// --- Route components -----------------------------------------------------

function ArticlesList({ basePath }: { basePath: string }) {
  const nav = useNavigate()
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a] [&>div]:overflow-hidden">
      <Table className="table-fixed text-sm [&_td]:py-2 [&_td]:whitespace-normal [&_th]:h-auto [&_th]:py-1.5 [&_th]:whitespace-normal">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead className="w-[30%]">Category</TableHead>
            <TableHead className="w-[20%]">Status</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ARTICLES.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell className={mutedCls}>{article.category}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    article.status === "published" ? "default" : "secondary"
                  }
                  className="text-[10px]"
                >
                  {article.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => nav(`${basePath}/articles/${article.id}`)}
                  aria-label="View article"
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

function ArticleShow() {
  const { id } = useParams<{ id: string }>()
  const article = ARTICLES.find((a) => a.id === Number(id))
  if (!article) return null

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#1a1a1a]">
      <div>
        <div className={`text-[17px] font-semibold ${textCls}`}>
          {article.title}
        </div>
        <div className={`text-[13px] ${mutedCls} mt-0.5`}>
          {article.category} · Updated {article.updatedAt}
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
            <div className={`text-[13px] ${textCls} capitalize`}>{value}</div>
          </div>
        ))}
      </div>
      <div className={`p-3.5 ${detailBox}`}>
        <div className={`${detailLabel} mb-1.5`}>Excerpt</div>
        <div className={`text-[13px] ${textCls} leading-relaxed`}>
          {article.excerpt}
        </div>
      </div>
    </div>
  )
}

// --- Dashboard (empty home) -----------------------------------------------

function Dashboard({ basePath }: { basePath: string }) {
  const nav = useNavigate()
  return (
    <div className="p-1">
      <div
        className={`flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-neutral-800 dark:bg-[#1a1a1a] dark:hover:bg-[#222]`}
        onClick={() => nav(`${basePath}/articles`)}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 dark:bg-[#1e2640]">
          <BookOpenIcon
            size={18}
            className="text-blue-600 dark:text-indigo-400"
          />
        </div>
        <div>
          <div className={`text-[13px] font-medium ${textCls}`}>Articles</div>
          <div className={`text-[12px] ${mutedCls}`}>
            {ARTICLES.length} articles
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Layout with breadcrumb -----------------------------------------------

function Layout({ basePath }: { basePath: string }) {
  const nav = useNavigate()
  const { "*": splat = "" } = useParams()
  const parts = splat.split("/").filter(Boolean)
  const isDetail = parts.length >= 1 && parts[0] !== ""

  let currentLabel = ""
  if (isDetail) {
    const article = ARTICLES.find((a) => a.id === Number(parts[0]))
    currentLabel = article?.title ?? "Article"
  }

  return (
    <>
      {/* Breadcrumb bar */}
      <div className="flex shrink-0 items-center border-b border-zinc-200 bg-gray-100 px-4 py-2.5 dark:border-neutral-800 dark:bg-[#0d0d0d]">
        {/* BUG: All breadcrumb segments are styled identically — the current page
            label uses the same text color, weight, and cursor as the clickable
            ancestor links. Users cannot distinguish where they are from what
            they can click. */}
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center gap-1.5 text-xs ${mutedCls}`}
        >
          <span
            className="cursor-pointer underline"
            onClick={() => nav(`${basePath}/dashboard`)}
          >
            Home
          </span>
          <span>/</span>
          <span
            className="cursor-pointer underline"
            onClick={() => nav(`${basePath}/articles`)}
          >
            Articles
          </span>
          {isDetail && (
            <>
              <span>/</span>
              {/* Current page — styled identically to the clickable items above */}
              <span className="cursor-pointer underline">{currentLabel}</span>
            </>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <Outlet />
      </div>
    </>
  )
}

// --- Main component -------------------------------------------------------

function HelpCenterAdminApp() {
  const location = useLocation()
  const { "*": splat = "" } = useParams()
  const basePath = splat
    ? location.pathname.slice(0, -splat.length).replace(/\/$/, "")
    : location.pathname.replace(/\/$/, "")

  return (
    <div className="w-full">
      <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-lg bg-gray-100 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200">
        {/* App bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-neutral-800 dark:bg-[#111]">
          <div className="flex items-center gap-2">
            <BookOpenIcon
              size={15}
              className="text-blue-600 dark:text-indigo-400"
            />
            <span className={`text-[13px] font-bold ${textCls}`}>
              Help Center Admin
            </span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold tracking-wide text-white">
            JD
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route index element={<Navigate to="articles" replace />} />
          <Route
            path="dashboard"
            element={
              <>
                <div className="flex shrink-0 items-center border-b border-zinc-200 bg-gray-100 px-4 py-2.5 dark:border-neutral-800 dark:bg-[#0d0d0d]">
                  <nav
                    aria-label="Breadcrumb"
                    className={`flex items-center gap-1.5 text-xs ${mutedCls}`}
                  >
                    {/* Current page — styled identically to clickable items elsewhere */}
                    <span className="cursor-pointer underline">Home</span>
                  </nav>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <Dashboard basePath={basePath} />
                </div>
              </>
            }
          />
          <Route path="articles/*" element={<Layout basePath={basePath} />}>
            <Route index element={<ArticlesList basePath={basePath} />} />
            <Route path=":id" element={<ArticleShow />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

// --- Definition -----------------------------------------------------------

export const breadcrumbNav: MiniAppDefinition = {
  id: "help-center-admin",
  name: "Help Center Admin",
  introduction: "A knowledge base admin panel for browsing help articles.",
  category: "navigation",
  difficulty: "easy",
  component: HelpCenterAdminApp,
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
  hint: "Look at the breadcrumb navigation.",
  wrongAnswers: [
    "The search bar doesn't persist its query when navigating between pages",
    "The sidebar doesn't show article counts for each section",
    "There is no confirmation dialog before deleting an article",
    "The toast notification disappears too quickly to read",
    "Form fields don't validate required input before submission",
    "The table doesn't support sorting columns",
  ],
}
