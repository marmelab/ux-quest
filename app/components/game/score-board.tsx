import { Banana } from "lucide-react"
import type { TestResult } from "~/lib/types"
import { computeMaxScore, computeTotalScore } from "~/lib/scoring"
import { getAllMiniApps } from "~/lib/mini-app-registry"

interface ScoreBoardProps {
  results: TestResult[]
}

export function ScoreBoard({ results }: ScoreBoardProps) {
  const totalScore = computeTotalScore(results)
  const allMiniApps = getAllMiniApps()

  // Compute max score from the mini-apps that were actually played
  const playedMiniApps = results
    .map((r) => allMiniApps.find((m) => m.id === r.miniAppId))
    .filter((m): m is (typeof allMiniApps)[number] => m != null)
  const maxScore = computeMaxScore(playedMiniApps)

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Your Score
      </p>
      <div className="flex items-center gap-3">
        <Banana className="size-10 text-amber-500" />
        <p className="text-6xl font-bold tabular-nums">
          {totalScore.toLocaleString()}
        </p>
      </div>
      <p className="text-lg text-muted-foreground">
        out of {maxScore.toLocaleString()}
      </p>
    </div>
  )
}
