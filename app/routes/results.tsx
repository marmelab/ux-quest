import { useLocation, useNavigate, useSearchParams } from "react-router"
import { BookOpen, ExternalLink, Home, RotateCcw } from "lucide-react"
import { Footer } from "~/components/footer"
import { ScoreBoard } from "~/components/game/score-board"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { computeMaxScore, computeTotalScore } from "~/lib/scoring"
import { getAllMiniApps } from "~/lib/mini-app-registry"
import type { TestResult } from "~/lib/types"

function getVerdict(ratio: number): string {
  if (ratio >= 0.9) return "Outstanding! You have a sharp eye for UX issues."
  if (ratio >= 0.7) return "Well done! You spotted most of the problems."
  if (ratio >= 0.5) return "Not bad, but there's room for improvement."
  if (ratio >= 0.3) return "Keep practicing — UX intuition takes time to build."
  return "Tough round! Don't worry, every expert started somewhere."
}

const UX_RESOURCES = [
  {
    name: "Nielsen Norman Group",
    url: "https://www.nngroup.com/articles/",
    description:
      "Research-backed articles from the practitioners who defined UX.",
  },
  {
    name: "Laws of UX",
    url: "https://lawsofux.com/",
    description:
      "Key psychological principles behind good design, beautifully presented.",
  },
  {
    name: "Interaction Design Foundation",
    url: "https://www.interaction-design.org/",
    description: "Structured curriculum for a progressive learning path.",
  },
  {
    name: "UX Collective",
    url: "https://uxdesign.cc/",
    description: "Practitioner writing on real-world UX problems and trends.",
  },
  {
    name: "Google UX Design Certificate",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    description: "Guided, hands-on introduction with a certificate at the end.",
  },
]

/** Parse ?score=N&max=M from the URL for testing the results page */
function useTestParams() {
  const [params] = useSearchParams()
  const score = params.get("score")
  const max = params.get("max")
  if (score == null || max == null) return null
  const s = Number(score)
  const m = Number(max)
  if (Number.isNaN(s) || Number.isNaN(m) || m <= 0) return null
  return { score: s, max: m }
}

export default function ResultsRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const testParams = useTestParams()
  const results = (location.state?.results as TestResult[]) ?? []

  // When using ?score=&max= we bypass the real results entirely
  const isTestMode = testParams != null
  if (!isTestMode && results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">No results to display.</p>
          <Button onClick={() => navigate("/")}>
            <Home className="size-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  let totalScore: number
  let maxScore: number

  if (isTestMode) {
    totalScore = testParams.score
    maxScore = testParams.max
  } else {
    const allMiniApps = getAllMiniApps()
    const playedMiniApps = results
      .map((r) => allMiniApps.find((m) => m.id === r.miniAppId))
      .filter((m) => m != null)
    maxScore = computeMaxScore(playedMiniApps)
    totalScore = computeTotalScore(results)
  }

  const ratio = maxScore > 0 ? totalScore / maxScore : 0

  return (
    <>
      <div className="flex flex-1 justify-center p-6 py-16">
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          {/* Score section */}
          <Card className="w-full">
            <CardContent className="flex flex-col items-center">
              <ScoreBoard
                results={isTestMode ? undefined : results}
                overrideScore={isTestMode ? totalScore : undefined}
                overrideMax={isTestMode ? maxScore : undefined}
              />
              <p className="mt-2 text-center text-sm font-medium">
                {getVerdict(ratio)}
              </p>
            </CardContent>
          </Card>

          {/* Actions section */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/game")}>
                <RotateCcw className="size-4" />
                Play Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="size-4" />
                Home
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Each game picks mini-apps at random — play again to
              <br />
              discover new challenges!
            </p>
          </div>

          {/* Resources section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Learn more about UX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {UX_RESOURCES.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2"
                    >
                      <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                      <span>
                        <span className="font-medium underline decoration-muted-foreground/40 underline-offset-2 transition-colors group-hover:decoration-foreground">
                          {r.name}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {r.description}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}
