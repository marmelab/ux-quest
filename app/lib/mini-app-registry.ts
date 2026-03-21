import { miniApps } from "~/mini-apps"
import type { Category, Difficulty, MiniAppDefinition } from "~/lib/types"

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"]

export function getAllMiniApps(): MiniAppDefinition[] {
  return miniApps
}

export function pickRandom(count: number): MiniAppDefinition[] {
  const shuffled = [...miniApps].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Pick mini-apps in progressive difficulty order (easy → medium → hard).
 * Returns `perDifficulty` apps per difficulty level, randomly selected within each.
 */
export function pickProgressive(perDifficulty: number): MiniAppDefinition[] {
  const byDifficulty = new Map<Difficulty, MiniAppDefinition[]>()
  for (const d of DIFFICULTY_ORDER) {
    const shuffled = miniApps
      .filter((m) => m.difficulty === d)
      .sort(() => Math.random() - 0.5)
    byDifficulty.set(d, shuffled.slice(0, perDifficulty))
  }
  return DIFFICULTY_ORDER.flatMap((d) => byDifficulty.get(d)!)
}

export function filterByCategory(category: Category): MiniAppDefinition[] {
  return miniApps.filter((m) => m.category === category)
}

export function filterByDifficulty(
  difficulty: Difficulty
): MiniAppDefinition[] {
  return miniApps.filter((m) => m.difficulty === difficulty)
}
