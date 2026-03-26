import { useState } from "react"
import {
  Bell,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  AtSign,
  Mail,
  Megaphone,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react"
import type { MiniAppDefinition } from "~/lib/types"

interface NotificationSetting {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

const initialSettings: NotificationSetting[] = [
  {
    id: "likes",
    label: "Likes",
    description: "When someone likes your post",
    icon: <Heart className="size-4" />,
    enabled: true,
  },
  {
    id: "comments",
    label: "Comments",
    description: "When someone comments on your post",
    icon: <MessageCircle className="size-4" />,
    enabled: true,
  },
  {
    id: "reposts",
    label: "Reposts",
    description: "When someone reposts your content",
    icon: <Repeat2 className="size-4" />,
    enabled: false,
  },
  {
    id: "new-followers",
    label: "New followers",
    description: "When someone follows you",
    icon: <UserPlus className="size-4" />,
    enabled: true,
  },
  {
    id: "mentions",
    label: "Mentions",
    description: "When someone mentions you in a post",
    icon: <AtSign className="size-4" />,
    enabled: true,
  },
  {
    id: "direct-messages",
    label: "Direct messages",
    description: "When you receive a new message",
    icon: <Mail className="size-4" />,
    enabled: true,
  },
  {
    id: "announcements",
    label: "Product updates",
    description: "News and feature announcements",
    icon: <Megaphone className="size-4" />,
    enabled: false,
  },
  {
    id: "security",
    label: "Security alerts",
    description: "Login attempts and account activity",
    icon: <ShieldCheck className="size-4" />,
    enabled: true,
  },
]

// BUG: The toggle switch uses the same color (gray) for both on and off states.
// The only difference is the knob position, making it very hard to tell which
// notifications are enabled vs disabled at a glance.
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 bg-zinc-200 transition-colors"
    >
      <span
        className={`inline-block size-4.5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState(initialSettings)
  const [allEnabled, setAllEnabled] = useState(true)

  function toggleSetting(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  function toggleAll() {
    const next = !allEnabled
    setAllEnabled(next)
    setSettings((prev) => prev.map((s) => ({ ...s, enabled: next })))
  }

  return (
    <div className="mx-auto mt-4 max-w-md text-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 pb-3">
        <button className="flex size-8 items-center justify-center rounded-full hover:bg-muted">
          <ChevronLeft className="size-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Bell className="size-5" />
          <h1 className="text-base font-semibold">Notifications</h1>
        </div>
      </div>

      {/* Master toggle */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="font-medium">Push notifications</p>
          <p className="text-xs text-muted-foreground">
            Enable or disable all notifications
          </p>
        </div>
        <Toggle checked={allEnabled} onChange={toggleAll} />
      </div>

      {/* Settings list */}
      <div className="flex flex-col">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {setting.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <Toggle
              checked={setting.enabled}
              onChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          You can also manage notifications in your email preferences.
        </p>
      </div>
    </div>
  )
}

export const notificationSettings: MiniAppDefinition = {
  id: "notification-settings",
  name: "Notification Preferences",
  introduction:
    "A mobile settings page for a social network app where you can choose which notifications to receive.",
  category: "accessibility",
  difficulty: "easy",
  component: NotificationSettings,
  expectedAnswers: [
    "The toggle switches look the same whether they are on or off — only the knob position changes, with no color difference.",
    "The on and off states of the switches use the same color, making it hard to tell which notifications are enabled.",
    "There is no color change between the enabled and disabled state of the toggles.",
    "The switches don't change color when toggled, so you can't quickly scan which ones are on or off.",
    "The toggle controls have identical styling for both states — the only visual cue is the knob position.",
    "It's difficult to distinguish enabled from disabled toggles because they share the same gray color.",
    "The toggles lack a distinct active color, making the on/off state ambiguous at a glance.",
    "Impossible to determine which buttons are active or inactive",
    "The toggles are the same color for on and off — can't tell the state at a glance.",
    "On/off switches need different colors, right now they're both gray.",
    "The switches don't visually indicate whether they're enabled or disabled.",
    "Hard to scan which notifications are turned on because the toggles all look identical.",
    "Toggle state is ambiguous — there's no color coding for on vs off.",
    "The switches should turn green or blue when active, but they stay gray.",
  ],
  hint: "Look closely at the toggle switches.",
  wrongAnswers: [
    "The icons are too small to understand what each notification type means.",
    "There is no way to save the notification preferences.",
    "The back button doesn't work or navigate anywhere.",
    "The notification descriptions are unclear or confusing.",
    "The page is missing a search or filter for notification types.",
  ],
}
