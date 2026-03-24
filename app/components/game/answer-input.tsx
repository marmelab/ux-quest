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
  hint: string
}

const WRONG_ANSWER_MESSAGES = [
  "Not quite — try again!",
  "Nope, that's not it.",
  "Not this time — look again.",
  "That's not the one.",
  "Incorrect — give it another go.",
  "Hmm, not exactly. What else do you notice?",
  "Keep looking — there's something off in there!",
  "Try describing it differently.",
  "Think about the user's goal — what's getting in their way?",
  "Consider the user's first impression of this UI.",
  "What would frustrate a real user trying to complete a task?",
  "Think about discoverability — can users find what they need?",
  "What expectation does this UI set that it doesn't fulfill?",
  "Focus on the core task — what makes it harder than it should be?",
  "Imagine using this under time pressure — what would trip you up?",
  "There's a classic UX anti-pattern hiding in there.",
  "Try a different angle.",
  "What's the first thing a new user would struggle with here?",
]

export function AnswerInput({
  onSubmit,
  onSkip,
  attemptsUsed,
  maxAttempts,
  isSubmitting,
  lastAttempt,
  hint,
}: AnswerInputProps) {
  const [text, setText] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const remaining = maxAttempts - attemptsUsed

  useEffect(() => {
    if (lastAttempt && !lastAttempt.correct) {
      const isLastAttempt = remaining === 1
      setFeedbackMessage(
        isLastAttempt
          ? hint
          : WRONG_ANSWER_MESSAGES[
              Math.floor(Math.random() * WRONG_ANSWER_MESSAGES.length)
            ]
      )
      textareaRef.current?.focus()
    }
  }, [lastAttempt, remaining, hint])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-medium">
        What is the UX problem?
        <span className="ml-2 text-muted-foreground">
          ({remaining} attempt{remaining > 1 ? "s" : ""} remaining)
        </span>
      </label>
      <Textarea
        ref={textareaRef}
        className="bg-background"
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
        <Button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="flex-1"
        >
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
      {lastAttempt && !lastAttempt.correct && (
        <div
          className={`rounded-lg px-4 py-3 ${
            remaining === 1
              ? "bg-amber-50 dark:bg-amber-950"
              : "bg-red-50 dark:bg-red-950"
          }`}
        >
          {remaining === 1 && (
            <p className="mb-1 text-xs font-semibold text-amber-600 uppercase dark:text-amber-400">
              Hint
            </p>
          )}
          <p
            className={`text-sm font-medium ${
              remaining === 1
                ? "text-amber-800 dark:text-amber-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            {feedbackMessage}
          </p>
        </div>
      )}
    </form>
  )
}
