import { useState } from "react"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  UserIcon,
  CheckIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Toaster } from "~/components/ui/sonner"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock data ---------------------------------------------------------------

const EVENT = {
  title: "Fearless Concurrency: Building Reliable Systems with Rust",
  group: "Portland Rust Developers",
  date: "Thursday, April 10, 2025",
  time: "6:30 PM – 8:30 PM",
  location: "TechHub PDX",
  address: "421 SW 5th Ave, Suite 300, Portland, OR 97204",
  attendees: 47,
  capacity: 60,
  speaker: {
    name: "Maya Chen",
    title: "Senior Systems Engineer at Oxide Computer",
    avatar: "MC",
  },
  tags: ["Rust", "Systems Programming", "Concurrency"],
  description:
    "Join us for an evening deep-dive into Rust's ownership model and how it enables fearless concurrency. Maya will walk through real-world examples from production systems, covering channels, async/await patterns, and how to avoid common pitfalls when building multi-threaded applications.",
  agenda: [
    { time: "6:30 PM", label: "Doors open & networking" },
    { time: "7:00 PM", label: "Talk: Fearless Concurrency in Rust" },
    { time: "7:45 PM", label: "Live coding demo" },
    { time: "8:15 PM", label: "Q&A and wrap-up" },
  ],
}

// --- Component ---------------------------------------------------------------

function MeetupEvent() {
  const [attending, setAttending] = useState(false)

  function handleToggleAttend() {
    const next = !attending
    setAttending(next)

    // BUG: The toast disappears after only 500ms — far too fast for users to read
    toast.success(
      next
        ? "You're attending this event!"
        : "You've been removed from this event.",
      { duration: 500 }
    )
  }

  return (
    <div className="flex flex-col">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="bg-linear-to-br from-orange-800 to-amber-700 px-5 py-6 text-white">
        <p className="mb-1 text-xs text-orange-100">{EVENT.group}</p>
        <h1 className="text-lg leading-tight font-semibold">{EVENT.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {EVENT.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border-white/40 bg-black/30 font-medium text-white hover:bg-black/40"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4 px-5 py-4">
        <div className="flex items-start gap-2.5">
          <CalendarIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm">{EVENT.date}</p>
        </div>
        <div className="flex items-start gap-2.5">
          <ClockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm">{EVENT.time}</p>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm">{EVENT.location}</p>
            <p className="text-xs text-muted-foreground">{EVENT.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <UsersIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm">
              {EVENT.attendees + (attending ? 1 : 0)} attending
            </p>
            <p className="text-xs text-muted-foreground">
              {EVENT.capacity - EVENT.attendees - (attending ? 1 : 0)} spots
              left
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Speaker */}
      <div className="px-5 py-4">
        <h2 className="mb-3 text-xs font-medium text-muted-foreground">
          Speaker
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-700">
            {EVENT.speaker.avatar}
          </div>
          <div>
            <p className="text-sm font-medium">{EVENT.speaker.name}</p>
            <p className="text-xs text-muted-foreground">
              {EVENT.speaker.title}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* About */}
      <div className="px-5 py-4">
        <h2 className="mb-2 text-xs font-medium text-muted-foreground">
          About this event
        </h2>
        <p className="text-sm leading-relaxed">{EVENT.description}</p>
      </div>

      <Separator />

      {/* Agenda */}
      <div className="px-5 py-4">
        <h2 className="mb-3 text-xs font-medium text-muted-foreground">
          Agenda
        </h2>
        <div className="space-y-2.5">
          {EVENT.agenda.map((item) => (
            <div key={item.time} className="flex items-baseline gap-3 text-sm">
              <span className="w-16 shrink-0 text-xs text-muted-foreground">
                {item.time}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky attend button */}
      <div className="sticky bottom-0 border-t bg-background px-5 py-3">
        <Button
          className="w-full"
          variant={attending ? "outline" : "default"}
          size="lg"
          onClick={handleToggleAttend}
        >
          {attending ? (
            <>
              <CheckIcon className="mr-1.5 size-4" />
              Attending — Tap to cancel
            </>
          ) : (
            <>
              <UserIcon className="mr-1.5 size-4" />
              Attend this event
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// --- Definition --------------------------------------------------------------

export const meetupEvent: MiniAppDefinition = {
  id: "meetup-event",
  name: "Meetup Event",
  introduction:
    "An interactive meetup app page letting people register their attendance for a talk.",
  category: "feedback",
  difficulty: "easy",
  component: MeetupEvent,
  expectedAnswers: [
    "The confirmation toast disappears too quickly to read",
    "The snackbar notification vanishes almost instantly after appearing",
    "The success message disappears after less than a second",
    "The feedback message flashes so briefly you can barely see it",
    "The notification that confirms attendance disappears too fast",
    "The toast duration is too short for the user to read the message",
    "The popup goes away way too fast after clicking attend.",
    "I can barely see the confirmation message — it flashes and disappears instantly.",
    "The notification timeout is way too short.",
    "Something appears briefly after clicking attend but I can't read it in time.",
    "The attend confirmation vanishes before I can process what it says.",
    "The feedback after clicking attend is too quick to notice.",
    "The notification disappears too fast.",
    "I saw something flash but couldn't read it.",
    "There's a message after clicking attend but it's gone instantly.",
  ],
  hint: "Try clicking the Attend button and pay close attention to what happens right after.",
  wrongAnswers: [
    "The attend button doesn't provide any confirmation feedback",
    "The event page is missing a map showing the venue location",
    "There is no way to add the event to your calendar",
    "The speaker section doesn't include a photo or bio link",
    "The color contrast of the header text is too low",
    "The attend button is hard to find on the page",
  ],
}
