import { useState } from "react"
import { Mail, Phone, MapPin, Globe, Building2, Clock } from "lucide-react"
import type { MiniAppDefinition } from "~/lib/types"

const LAST_SEEN_DATE = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

function getRelativeTime(date: Date): string {
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffSeconds = Math.round(diffMs / 1000)
  const diffMinutes = Math.round(diffSeconds / 60)
  const diffHours = Math.round(diffMinutes / 60)
  const diffDays = Math.round(diffHours / 24)
  const diffWeeks = Math.round(diffDays / 7)
  const diffMonths = Math.round(diffDays / 30)
  const diffYears = Math.round(diffDays / 365)

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (Math.abs(diffSeconds) < 60) return rtf.format(-diffSeconds, "second")
  if (Math.abs(diffMinutes) < 60) return rtf.format(-diffMinutes, "minute")
  if (Math.abs(diffHours) < 24) return rtf.format(-diffHours, "hour")
  if (Math.abs(diffDays) < 7) return rtf.format(-diffDays, "day")
  if (Math.abs(diffWeeks) < 4) return rtf.format(-diffWeeks, "week")
  if (Math.abs(diffMonths) < 12) return rtf.format(-diffMonths, "month")
  return rtf.format(-diffYears, "year")
}

function ContactSheet() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="mx-auto max-w-sm rounded-xl bg-zinc-900 p-4 text-zinc-100 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-zinc-700 p-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
          MR
        </div>
        <div>
          {/* BUG: font size 1 — text-xl (20px) */}
          <p className="text-xl font-semibold text-zinc-50">Maria Rodriguez</p>
          {/* BUG: font size 2 — text-[15px], slightly smaller but not the same as values */}
          <p className="text-[15px] text-zinc-400">Senior Product Manager</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <Building2 className="size-4 shrink-0 text-zinc-500" />
          <div>
            {/* BUG: font size 3 — text-[11px] for labels */}
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Company
            </p>
            {/* BUG: font size 4 — text-sm (14px) for values */}
            <p className="text-sm text-zinc-200">Nexus Technologies Inc.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="size-4 shrink-0 text-zinc-500" />
          <div>
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Email
            </p>
            <p className="text-sm text-zinc-200">m.rodriguez@nexustech.io</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="size-4 shrink-0 text-zinc-500" />
          <div>
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Phone
            </p>
            <p className="text-sm text-zinc-200">+1 (415) 867-5309</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="size-4 shrink-0 text-zinc-500" />
          <div>
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Address
            </p>
            <p className="text-sm text-zinc-200">
              742 Evergreen Terrace, San Francisco, CA 94110
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Globe className="size-4 shrink-0 text-zinc-500" />
          <div>
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Website
            </p>
            <p className="text-sm text-indigo-400">nexustech.io</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="size-4 shrink-0 text-zinc-500" />
          <div>
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Last Seen
            </p>
            <p
              className="relative cursor-default text-sm text-zinc-200"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {getRelativeTime(LAST_SEEN_DATE)}
              {showTooltip && (
                <span className="absolute bottom-full left-0 z-10 mb-1 rounded bg-zinc-700 px-2 py-1 text-xs whitespace-nowrap text-zinc-100 shadow-lg">
                  {LAST_SEEN_DATE.toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex gap-4 border-t border-zinc-700 px-5 py-4">
        <div className="flex-1 text-center">
          <p className="text-2xl font-semibold text-zinc-100">12</p>
          <p className="text-xs text-zinc-400">Meetings</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-2xl font-semibold text-zinc-100">47</p>
          <p className="text-xs text-zinc-400">Emails</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-2xl font-semibold text-zinc-100">3</p>
          <p className="text-xs text-zinc-400">Projects</p>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-zinc-700 p-5">
        <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          Notes
        </p>
        <p className="mt-1 text-base leading-relaxed text-zinc-300">
          Key stakeholder for the Q2 platform redesign. Prefers async
          communication. Follow up after the April board meeting.
        </p>
      </div>
    </div>
  )
}

export const contactSheet: MiniAppDefinition = {
  id: "contact-sheet",
  name: "Contact Sheet",
  introduction: "A detailed contact information sheet.",
  category: "layout",
  difficulty: "easy",
  component: ContactSheet,
  expectedAnswers: [
    "There are too many different font sizes, making the layout feel inconsistent.",
    "The text sizes vary too much across the card — there is no clear typographic hierarchy.",
    "Font sizes are inconsistent: some values use a smaller size while others are noticeably larger.",
    "The typography is messy because different fields use different font sizes for no apparent reason.",
    "There are at least four different font sizes used, which makes the card look unpolished.",
    "The name, subtitle, labels, and values each use a slightly different font size when fewer would suffice.",
    "The card uses seven distinct type sizes creating a cluttered visual hierarchy.",
  ],
  hint: "Visual hierarchy and consistency are key for readability.",
  wrongAnswers: [
    "The contrast between text and background is too low to read.",
    "There is no way to edit the contact information.",
    "The dark mode colors are too harsh on the eyes.",
    "The card is missing a profile picture.",
    "The layout does not work on mobile screens.",
    "The icons are not aligned with the text.",
  ],
}
