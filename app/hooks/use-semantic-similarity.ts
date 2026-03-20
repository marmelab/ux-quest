import { useCallback, useEffect, useState } from "react"
import {
  computeBestSimilarity,
  computeContrastiveSimilarity,
  loadModel,
} from "~/lib/semantic-similarity.client"

export function useSemanticSimilarity() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadModel()
      .then(() => setIsLoading(false))
      .catch((e: Error) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [])

  const compare = useCallback(
    async (
      userAnswer: string,
      expectedAnswers: string[],
      wrongAnswers?: string[],
    ): Promise<number> => {
      if (wrongAnswers && wrongAnswers.length > 0) {
        return computeContrastiveSimilarity(
          userAnswer,
          expectedAnswers,
          wrongAnswers,
        )
      }
      return computeBestSimilarity(userAnswer, expectedAnswers)
    },
    [],
  )

  return { isLoading, error, compare }
}
