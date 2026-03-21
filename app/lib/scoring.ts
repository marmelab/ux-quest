import type { Difficulty, TestResult } from "./types"
import type { MiniAppDefinition } from "./types"

const BASE_POINTS: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  hard: 300,
}

const ATTEMPT_MULTIPLIERS = [3, 2, 1] as const

export function computeQuestionScore(
  difficulty: Difficulty,
  attemptCount: number,
  passed: boolean
): number {
  if (!passed) return 0
  const multiplier = ATTEMPT_MULTIPLIERS[attemptCount - 1] ?? 1
  return BASE_POINTS[difficulty] * multiplier
}

export function computeTotalScore(results: TestResult[]): number {
  return results.reduce((sum, r) => sum + r.score, 0)
}

export function computeMaxScore(miniApps: MiniAppDefinition[]): number {
  return miniApps.reduce(
    (sum, app) => sum + BASE_POINTS[app.difficulty] * ATTEMPT_MULTIPLIERS[0],
    0
  )
}
