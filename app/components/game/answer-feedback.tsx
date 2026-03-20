import { Button } from "~/components/ui/button"
import type { AttemptResult } from "~/lib/types"

interface AnswerFeedbackProps {
  attempts: AttemptResult[]
  passed: boolean
  expectedAnswer: string
  onNext: () => void
  isLast: boolean
}

export function AnswerFeedback({
  attempts,
  passed,
  expectedAnswer,
  onNext,
  isLast,
}: AnswerFeedbackProps) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-lg p-4 ${
          passed
            ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
            : "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
        }`}
      >
        <p className="font-medium">{passed ? "Correct!" : "Incorrect"}</p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
          Expected Answer
        </p>
        <p className="text-sm">{expectedAnswer}</p>
      </div>

      <Button onClick={onNext}>
        {isLast ? "See Results" : "Next Question"}
      </Button>
    </div>
  )
}
