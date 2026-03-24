import { Banana } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { AttemptResult } from "~/lib/types"

interface AnswerFeedbackProps {
  attempts: AttemptResult[]
  passed: boolean
  skipped?: boolean
  expectedAnswer: string
  score: number
  onNext: () => void
  isLast: boolean
}

export function AnswerFeedback({
  passed,
  skipped,
  expectedAnswer,
  score,
  onNext,
  isLast,
}: AnswerFeedbackProps) {
  return (
    <div className="flex flex-col gap-4">
      {!skipped && (
        <div
          className={`flex items-center justify-between rounded-lg p-4 ${
            passed
              ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
              : "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
          }`}
        >
          <p className="font-medium">{passed ? "Correct!" : "Incorrect"}</p>
          <span className="flex items-center gap-1 font-semibold">
            <Banana className="size-4" />+{score.toLocaleString()}
          </span>
        </div>
      )}

      <div>
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
