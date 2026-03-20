import type { FeatureExtractionPipeline } from "@huggingface/transformers"

export const SIMILARITY_THRESHOLD = 0.65
/** Minimum gap between best-right and best-wrong scores for contrastive check */
export const CONTRASTIVE_MARGIN = 0.1

let extractor: FeatureExtractionPipeline | null = null
let loadingPromise: Promise<void> | null = null

export async function loadModel(): Promise<void> {
  if (extractor) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const transformers = await import("@huggingface/transformers")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (transformers.pipeline as any)(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "q8" },
    )
    extractor = result as FeatureExtractionPipeline
  })()

  return loadingPromise
}

export async function computeSimilarity(
  text1: string,
  text2: string,
): Promise<number> {
  if (!extractor) await loadModel()

  const [emb1, emb2] = await Promise.all([
    extractor!(text1, { pooling: "mean", normalize: true }),
    extractor!(text2, { pooling: "mean", normalize: true }),
  ])

  const a = Array.from(emb1.data as Float32Array)
  const b = Array.from(emb2.data as Float32Array)

  return cosineSimilarity(a, b)
}

/**
 * Compare user answer against multiple accepted phrasings, return the best score.
 */
export async function computeBestSimilarity(
  userAnswer: string,
  expectedAnswers: string[],
): Promise<number> {
  if (!extractor) await loadModel()

  const userEmb = await extractor!(userAnswer, { pooling: "mean", normalize: true })
  const userVec = Array.from(userEmb.data as Float32Array)

  let best = 0
  for (const expected of expectedAnswers) {
    const expEmb = await extractor!(expected, { pooling: "mean", normalize: true })
    const expVec = Array.from(expEmb.data as Float32Array)
    const score = cosineSimilarity(userVec, expVec)
    if (score > best) best = score
  }
  return best
}

/**
 * Contrastive scoring: compare user answer against both correct and wrong answers.
 * Returns an adjusted score that penalizes answers closer to wrong examples.
 */
export async function computeContrastiveSimilarity(
  userAnswer: string,
  expectedAnswers: string[],
  wrongAnswers: string[],
): Promise<number> {
  if (!extractor) await loadModel()

  const userEmb = await extractor!(userAnswer, {
    pooling: "mean",
    normalize: true,
  })
  const userVec = Array.from(userEmb.data as Float32Array)

  let bestRight = 0
  for (const expected of expectedAnswers) {
    const emb = await extractor!(expected, { pooling: "mean", normalize: true })
    const vec = Array.from(emb.data as Float32Array)
    const score = cosineSimilarity(userVec, vec)
    if (score > bestRight) bestRight = score
  }

  let bestWrong = 0
  for (const wrong of wrongAnswers) {
    const emb = await extractor!(wrong, { pooling: "mean", normalize: true })
    const vec = Array.from(emb.data as Float32Array)
    const score = cosineSimilarity(userVec, vec)
    if (score > bestWrong) bestWrong = score
  }

  // If the answer is closer to a wrong example (within margin), reject it
  if (bestRight - bestWrong < CONTRASTIVE_MARGIN) {
    return bestRight * (0.5 + 0.5 * (bestRight - bestWrong) / CONTRASTIVE_MARGIN)
  }

  return bestRight
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}
