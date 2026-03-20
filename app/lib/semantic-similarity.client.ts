import type { FeatureExtractionPipeline } from "@huggingface/transformers"

export const SIMILARITY_THRESHOLD = 0.65

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
