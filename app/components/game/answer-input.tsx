import { useEffect, useRef, useState } from "react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import type { AttemptResult } from "~/lib/types"

interface AnswerInputProps {
  onSubmit: (text: string) => void
  onSkip: () => void
  attemptsUsed: number
  maxAttempts: number
  isSubmitting: boolean
  lastAttempt?: AttemptResult
}

export function AnswerInput({
  onSubmit,
  onSkip,
  attemptsUsed,
  maxAttempts,
  isSubmitting,
  lastAttempt,
}: AnswerInputProps) {
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const remaining = maxAttempts - attemptsUsed

  useEffect(() => {
    if (lastAttempt && !lastAttempt.correct) {
      textareaRef.current?.focus()
    }
  }, [lastAttempt])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div
        className={`rounded-lg px-4 py-3 transition-opacity ${
          lastAttempt && !lastAttempt.correct
            ? "bg-red-50 opacity-100 dark:bg-red-950"
            : "opacity-0"
        }`}
      >
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          {lastAttempt && !lastAttempt.correct
            ? `Not quite — try again!`
            : "\u00A0"}
        </p>
      </div>
      <label className="text-sm font-medium">
        What is the UX problem?
        <span className="ml-2 text-muted-foreground">
          ({remaining} attempt{remaining > 1 ? "s" : ""} remaining)
        </span>
      </label>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        placeholder="Describe the UX problem you detected..."
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={!text.trim() || isSubmitting} className="flex-1">
          {isSubmitting ? "Analyzing..." : "Submit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onSkip}
        >
          Skip
        </Button>
      </div>
    </form>
  )
}
