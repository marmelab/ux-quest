import { Banana } from "lucide-react"
import type { Difficulty } from "~/lib/types"

interface ProgressBarProps {
  current: number
  total: number
  perDifficulty: number
  score: number
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-red-500",
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

export function ProgressBar({
  current,
  total,
  perDifficulty,
  score,
}: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Question {current} / {total}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border-2 border-border px-3 py-0.5 font-semibold">
          <Banana className="size-4 text-amber-500" />
          {score.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-1">
        {DIFFICULTIES.map((difficulty) => {
          const sectionStart =
            DIFFICULTIES.indexOf(difficulty) * perDifficulty + 1
          return (
            <div key={difficulty} className="flex flex-1 gap-0.5">
              {Array.from({ length: perDifficulty }, (_, i) => {
                const questionNum = sectionStart + i
                const isCompleted = questionNum < current
                const isCurrent = questionNum === current
                return (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      isCompleted || isCurrent
                        ? DIFFICULTY_COLORS[difficulty]
                        : "bg-muted"
                    } ${isCurrent ? "opacity-70" : ""}`}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
