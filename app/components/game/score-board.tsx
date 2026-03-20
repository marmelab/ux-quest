import type { TestResult } from "~/lib/types"
import { getAllMiniApps } from "~/lib/mini-app-registry"

interface ScoreBoardProps {
  results: TestResult[]
}

export function ScoreBoard({ results }: ScoreBoardProps) {
  const score = results.filter((r) => r.passed).length
  const allMiniApps = getAllMiniApps()

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Your Score</p>
        <p className="text-5xl font-bold">
          {score}
          <span className="text-2xl text-muted-foreground">
            {" "}
            / {results.length}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {results.map((result) => {
          const miniApp = allMiniApps.find((m) => m.id === result.miniAppId)
          return (
            <div
              key={result.miniAppId}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {miniApp?.name ?? result.miniAppId}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.attempts.length} attempt
                  {result.attempts.length > 1 ? "s" : ""}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${
                  result.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.passed ? "Found" : "Missed"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
