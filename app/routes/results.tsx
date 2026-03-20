import { useLocation, useNavigate } from "react-router"
import { ScoreBoard } from "~/components/game/score-board"
import { Button } from "~/components/ui/button"
import type { TestResult } from "~/lib/types"

export default function ResultsRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const results = (location.state?.results as TestResult[]) ?? []

  if (results.length === 0) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">No results to display.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <ScoreBoard results={results} />
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/game")}>Play Again</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
