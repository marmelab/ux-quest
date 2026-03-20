import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import type { AttemptResult } from "~/lib/types"

interface AnswerInputProps {
  onSubmit: (text: string) => void
  attemptsUsed: number
  maxAttempts: number
  isSubmitting: boolean
  lastAttempt?: AttemptResult
}

export function AnswerInput({
  onSubmit,
  attemptsUsed,
  maxAttempts,
  isSubmitting,
  lastAttempt,
}: AnswerInputProps) {
  const [text, setText] = useState("")
  const remaining = maxAttempts - attemptsUsed

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {lastAttempt && !lastAttempt.correct && (
        <div className="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Not quite ({Math.round(lastAttempt.similarity * 100)}% match) — try again!
          </p>
        </div>
      )}
      <label className="text-sm font-medium">
        What is the UX problem?
        <span className="text-muted-foreground ml-2">
          ({remaining} attempt{remaining > 1 ? "s" : ""} remaining)
        </span>
      </label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the UX problem you detected..."
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={!text.trim() || isSubmitting}>
        {isSubmitting ? "Analyzing..." : "Submit"}
      </Button>
    </form>
  )
}
