import { miniApps } from "~/mini-apps"
import type { Category, Difficulty, MiniAppDefinition } from "~/lib/types"

export function getAllMiniApps(): MiniAppDefinition[] {
  return miniApps
}

export function pickRandom(count: number): MiniAppDefinition[] {
  const shuffled = [...miniApps].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function filterByCategory(category: Category): MiniAppDefinition[] {
  return miniApps.filter((m) => m.category === category)
}

export function filterByDifficulty(
  difficulty: Difficulty
): MiniAppDefinition[] {
  return miniApps.filter((m) => m.difficulty === difficulty)
}
