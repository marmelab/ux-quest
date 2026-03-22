import { useEffect, useState } from "react"
import { Banana } from "lucide-react"
import type { TestResult } from "~/lib/types"
import { computeMaxScore, computeTotalScore } from "~/lib/scoring"
import { getAllMiniApps } from "~/lib/mini-app-registry"
import { useAnimatedNumber } from "~/hooks/use-animated-number"

interface ScoreBoardProps {
  results?: TestResult[]
  /** Override the displayed score (used for testing via URL params) */
  overrideScore?: number
  /** Override the displayed max score (used for testing via URL params) */
  overrideMax?: number
}

export function ScoreBoard({
  results,
  overrideScore,
  overrideMax,
}: ScoreBoardProps) {
  let totalScore: number
  let maxScore: number

  if (overrideScore != null && overrideMax != null) {
    totalScore = overrideScore
    maxScore = overrideMax
  } else {
    const r = results ?? []
    totalScore = computeTotalScore(r)
    const allMiniApps = getAllMiniApps()
    const playedMiniApps = r
      .map((res) => allMiniApps.find((m) => m.id === res.miniAppId))
      .filter((m): m is (typeof allMiniApps)[number] => m != null)
    maxScore = computeMaxScore(playedMiniApps)
  }

  // Animate from 0 on mount
  const [scoreTarget, setScoreTarget] = useState(0)
  useEffect(() => {
    setScoreTarget(totalScore)
  }, [totalScore])
  const displayScore = useAnimatedNumber(scoreTarget)

  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <p className="text-sm text-muted-foreground">Your Score</p>
      <div className="flex items-center gap-3">
        <Banana className="size-10 text-amber-500" />
        <p className="text-6xl font-bold tabular-nums">
          {displayScore.toLocaleString()}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        out of {maxScore.toLocaleString()}
      </p>
    </div>
  )
}
