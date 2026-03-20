import type { ComponentType } from "react"

export type Category =
  | "navigation"
  | "forms"
  | "feedback"
  | "accessibility"
  | "layout"
  | "interaction"

export type Difficulty = "easy" | "medium" | "hard"

export interface MiniAppDefinition {
  id: string
  name: string
  /** Short introduction displayed to the user explaining what the mini-app is about */
  introduction: string
  category: Category
  difficulty: Difficulty
  component: ComponentType
  /** Accepted answer phrasings — user answer is compared to each, best match wins */
  expectedAnswers: string[]
  /** Plausible-but-wrong answers — used to reject topically similar but incorrect responses */
  wrongAnswers?: string[]
}

export interface AttemptResult {
  text: string
  similarity: number
  correct: boolean
}

export interface TestResult {
  miniAppId: string
  attempts: AttemptResult[]
  passed: boolean
}

export type GamePhase = "idle" | "playing" | "reviewing" | "finished"

export interface GameState {
  phase: GamePhase
  selectedMiniApps: MiniAppDefinition[]
  currentIndex: number
  results: TestResult[]
  currentAttempts: AttemptResult[]
}
