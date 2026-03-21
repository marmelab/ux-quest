import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { useGame } from "~/hooks/use-game"
import { useSemanticSimilarity } from "~/hooks/use-semantic-similarity"
import { computeTotalScore } from "~/lib/scoring"
import { SIMILARITY_THRESHOLD } from "~/lib/semantic-similarity.client"
import { AnswerFeedback } from "./answer-feedback"
import { AnswerInput } from "./answer-input"
import { MiniAppPlayer } from "./mini-app-player"
import { ProgressBar } from "./progress-bar"
export function GameSession() {
  const { state, startGame, submitAnswer, nextAfterReview, maxAttempts } =
    useGame()
  const { compare } = useSemanticSimilarity()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalScore = useMemo(
    () => computeTotalScore(state.results),
    [state.results]
  )

  // Auto-start the game on mount
  useEffect(() => {
    if (state.phase === "idle") {
      startGame()
    }
  }, [state.phase, startGame])

  const handleSubmit = useCallback(
    async (text: string) => {
      const currentMiniApp = state.selectedMiniApps[state.currentIndex]
      setIsSubmitting(true)
      try {
        const similarity = await compare(
          text,
          currentMiniApp.expectedAnswers,
          currentMiniApp.wrongAnswers
        )
        submitAnswer({
          text,
          similarity,
          correct: similarity >= SIMILARITY_THRESHOLD,
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [state.selectedMiniApps, state.currentIndex, compare, submitAnswer]
  )

  const handleNext = useCallback(() => {
    const nextIndex = state.currentIndex + 1
    if (nextIndex >= state.selectedMiniApps.length) {
      navigate("/results", { state: { results: state.results } })
    } else {
      nextAfterReview()
    }
  }, [
    state.currentIndex,
    state.selectedMiniApps.length,
    state.results,
    navigate,
    nextAfterReview,
  ])

  // Idle phase — auto-starting, show nothing
  if (state.phase === "idle") {
    return null
  }

  // Finished phase — redirect to results
  if (state.phase === "finished") {
    navigate("/results", { state: { results: state.results } })
    return null
  }

  const currentMiniApp = state.selectedMiniApps[state.currentIndex]
  const isReviewing = state.phase === "reviewing"
  const lastResult = isReviewing
    ? state.results[state.results.length - 1]
    : null

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <ProgressBar
          current={state.currentIndex + 1}
          total={state.selectedMiniApps.length}
          perDifficulty={3}
          score={totalScore}
        />

        <MiniAppPlayer miniApp={currentMiniApp} />

        {isReviewing && lastResult ? (
          <AnswerFeedback
            attempts={lastResult.attempts}
            passed={lastResult.passed}
            expectedAnswer={currentMiniApp.expectedAnswers[0]}
            score={lastResult.score}
            onNext={handleNext}
            isLast={state.currentIndex === state.selectedMiniApps.length - 1}
          />
        ) : (
          <AnswerInput
            onSubmit={handleSubmit}
            attemptsUsed={state.currentAttempts.length}
            maxAttempts={maxAttempts}
            isSubmitting={isSubmitting}
            lastAttempt={
              state.currentAttempts.length > 0
                ? state.currentAttempts[state.currentAttempts.length - 1]
                : undefined
            }
          />
        )}
      </div>
    </div>
  )
}
