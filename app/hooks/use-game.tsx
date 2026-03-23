import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from "react"
import { pickProgressive } from "~/lib/mini-app-registry"
import { computeQuestionScore } from "~/lib/scoring"
import type {
  AttemptResult,
  GamePhase,
  GameState,
  TestResult,
} from "~/lib/types"

const MAX_ATTEMPTS = 3
const PER_DIFFICULTY = 3

const initialState: GameState = {
  phase: "idle",
  selectedMiniApps: [],
  currentIndex: 0,
  results: [],
  currentAttempts: [],
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "SUBMIT_ATTEMPT"; attempt: AttemptResult }
  | { type: "SKIP" }
  | { type: "NEXT_MINI_APP" }
  | { type: "RESET" }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      return {
        phase: "playing",
        selectedMiniApps: pickProgressive(PER_DIFFICULTY),
        currentIndex: 0,
        results: [],
        currentAttempts: [],
      }
    }

    case "SUBMIT_ATTEMPT": {
      const attempts = [...state.currentAttempts, action.attempt]
      const isCorrect = action.attempt.correct
      const isLastAttempt = attempts.length >= MAX_ATTEMPTS

      if (isCorrect || isLastAttempt) {
        const difficulty = state.selectedMiniApps[state.currentIndex].difficulty
        const score = computeQuestionScore(
          difficulty,
          attempts.length,
          isCorrect
        )
        const result: TestResult = {
          miniAppId: state.selectedMiniApps[state.currentIndex].id,
          attempts,
          passed: isCorrect,
          score,
        }
        return {
          ...state,
          phase: "reviewing",
          currentAttempts: attempts,
          results: [...state.results, result],
        }
      }

      return { ...state, currentAttempts: attempts }
    }

    case "SKIP": {
      const result: TestResult = {
        miniAppId: state.selectedMiniApps[state.currentIndex].id,
        attempts: state.currentAttempts,
        passed: false,
        score: 0,
        skipped: true,
      }
      return {
        ...state,
        phase: "reviewing",
        results: [...state.results, result],
      }
    }

    case "NEXT_MINI_APP": {
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.selectedMiniApps.length) {
        return { ...state, phase: "finished" }
      }
      return {
        ...state,
        phase: "playing",
        currentIndex: nextIndex,
        currentAttempts: [],
      }
    }

    case "RESET":
      return initialState

    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  startGame: () => void
  submitAnswer: (attempt: AttemptResult) => void
  skipQuestion: () => void
  nextAfterReview: () => void
  resetGame: () => void
  maxAttempts: number
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const startGame = useCallback(() => dispatch({ type: "START_GAME" }), [])
  const submitAnswer = useCallback(
    (attempt: AttemptResult) => dispatch({ type: "SUBMIT_ATTEMPT", attempt }),
    []
  )
  const skipQuestion = useCallback(() => dispatch({ type: "SKIP" }), [])
  const nextAfterReview = useCallback(
    () => dispatch({ type: "NEXT_MINI_APP" }),
    []
  )
  const resetGame = useCallback(() => dispatch({ type: "RESET" }), [])

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        submitAnswer,
        skipQuestion,
        nextAfterReview,
        resetGame,
        maxAttempts: MAX_ATTEMPTS,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
