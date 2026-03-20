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
        <p className="font-medium">
          {passed ? "Correct!" : "Incorrect"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Your attempts:</p>
        {attempts.map((attempt, i) => (
          <div
            key={i}
            className="bg-muted flex items-center justify-between rounded-lg px-3 py-2 text-sm"
          >
            <span className="flex-1">{attempt.text}</span>
            <span
              className={`ml-2 text-xs font-medium ${
                attempt.correct ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {Math.round(attempt.similarity * 100)}%
            </span>
          </div>
        ))}
      </div>

      <div className="border-border rounded-lg border p-4">
        <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
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
