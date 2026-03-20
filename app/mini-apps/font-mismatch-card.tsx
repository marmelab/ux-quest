import { useState } from "react"
import type { MiniAppDefinition } from "~/lib/types"

interface UserData {
  name: string
  email: string
  role: string
  department: string
  location: string
}

const initialUser: UserData = {
  name: "Alice Johnson",
  email: "alice.johnson@acme.com",
  role: "Product Designer",
  department: "Design Systems",
  location: "San Francisco, CA",
}

function FontMismatchCard() {
  const [user, setUser] = useState<UserData>(initialUser)
  const [editing, setEditing] = useState<keyof UserData | null>(null)
  const [draft, setDraft] = useState("")
  const [saved, setSaved] = useState(false)

  function startEditing(field: keyof UserData) {
    setEditing(field)
    setDraft(user[field])
  }

  function save() {
    if (editing) {
      if (draft !== user[editing]) {
        setUser((prev) => ({ ...prev, [editing]: draft }))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
      setEditing(null)
    }
  }

  function cancel() {
    setEditing(null)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save()
    if (e.key === "Escape") cancel()
  }

  const fields: { key: keyof UserData; label: string }[] = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address" },
    { key: "role", label: "Job Title" },
    { key: "department", label: "Department" },
    { key: "location", label: "Location" },
  ]

  return (
    <div className="mx-auto max-w-md text-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-muted-foreground">
            {user.role} · {user.department}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="mt-3 flex flex-col">
        {fields.map(({ key, label }) => (
          <div
            key={key}
            className={`group flex items-center justify-between rounded-lg px-0 py-2 ${editing !== key ? "cursor-pointer hover:bg-muted/50" : ""}`}
            onClick={() => editing !== key && startEditing(key)}
          >
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{label}</span>
              {editing === key ? (
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={save}
                  autoFocus
                  className="w-full border-b border-border bg-transparent py-0.5 outline-none focus:border-ring"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                />
              ) : (
                <span className="py-0.5">{user[key]}</span>
              )}
            </div>
            {editing !== key && (
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                Edit
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-xs text-muted-foreground">
          Member since Jan 2024
        </span>
        {saved && <span className="text-xs text-green-600">Changes saved</span>}
      </div>
    </div>
  )
}

export const fontMismatchCard: MiniAppDefinition = {
  id: "font-mismatch-card",
  name: "User Profile Card",
  category: "forms",
  difficulty: "medium",
  component: FontMismatchCard,
  expectedAnswers: [
    "The font changes when editing a field. The input uses a different font than the display text.",
    "The edit input has a different font family than the static text, causing a visual jump.",
    "When clicking to edit, the text switches to a different font, making the transition jarring.",
    "The font in edit mode doesn't match the font used in display mode.",
    "There is a font mismatch between the read-only text and the editable input.",
    "The text appearance changes when switching to edit mode — the font looks different.",
    "The font size or style changes when you click to edit a field.",
    "The input text looks different from the display text when editing in place.",
    "The layout shifts when switching to edit mode.",
  ],
  wrongAnswers: [
    "The mouse cursor doesn't change to indicate the text is editable.",
    "There is no visual indicator that fields are clickable.",
    "The save button is missing or hard to find.",
    "The text is too small to read.",
    "The color contrast is too low for accessibility.",
    "There is no confirmation before saving changes.",
  ],
}
