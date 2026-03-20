export const SIMILARITY_THRESHOLD = 0.65
/** Minimum gap between best-right and best-wrong scores for contrastive check */
export const CONTRASTIVE_MARGIN = 0.1

const CROSS_ENCODER_MODEL = "Xenova/ms-marco-MiniLM-L-6-v2"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tokenizer: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let model: any = null
let loadingPromise: Promise<void> | null = null

export async function loadModel(): Promise<void> {
  if (model) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const { AutoTokenizer, AutoModelForSequenceClassification } = await import(
      "@huggingface/transformers"
    )
    ;[tokenizer, model] = await Promise.all([
      AutoTokenizer.from_pretrained(CROSS_ENCODER_MODEL),
      AutoModelForSequenceClassification.from_pretrained(CROSS_ENCODER_MODEL, {
        dtype: "q8",
      }),
    ])
  })()

  return loadingPromise
}

/**
 * Score a pair of texts using the cross-encoder.
 * Returns a relevance score (higher = more similar in meaning).
 */
async function scorePair(text1: string, text2: string): Promise<number> {
  const inputs = tokenizer(text1, {
    text_pair: text2,
    padding: true,
    truncation: true,
    return_tensor: true,
  })
  const output = await model(inputs)
  // Cross-encoder outputs logits; single score for relevance
  return output.logits.data[0] as number
}

/**
 * Normalize a raw cross-encoder logit to 0–1 range using sigmoid.
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

export async function computeSimilarity(
  text1: string,
  text2: string,
): Promise<number> {
  if (!model) await loadModel()
  const raw = await scorePair(text1, text2)
  return sigmoid(raw)
}

/**
 * Compare user answer against multiple accepted phrasings, return the best score.
 */
export async function computeBestSimilarity(
  userAnswer: string,
  expectedAnswers: string[],
): Promise<number> {
  if (!model) await loadModel()

  let best = -Infinity
  for (const expected of expectedAnswers) {
    const score = await scorePair(userAnswer, expected)
    if (score > best) best = score
  }
  return sigmoid(best)
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
  if (!model) await loadModel()

  let bestRight = -Infinity
  for (const expected of expectedAnswers) {
    const score = await scorePair(userAnswer, expected)
    if (score > bestRight) bestRight = score
  }

  let bestWrong = -Infinity
  for (const wrong of wrongAnswers) {
    const score = await scorePair(userAnswer, wrong)
    if (score > bestWrong) bestWrong = score
  }

  const normRight = sigmoid(bestRight)
  const normWrong = sigmoid(bestWrong)

  // If the answer is closer to a wrong example (within margin), reject it
  if (normRight - normWrong < CONTRASTIVE_MARGIN) {
    return (
      normRight *
      (0.5 + (0.5 * (normRight - normWrong)) / CONTRASTIVE_MARGIN)
    )
  }

  return normRight
}
