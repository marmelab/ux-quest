import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { isModelReady, loadModel } from "~/lib/semantic-similarity.client"

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Preload model in the background as soon as the home page renders
  useEffect(() => {
    loadModel().catch(() => {})
  }, [])

  function handleStart() {
    if (isModelReady()) {
      navigate("/game")
      return
    }
    setLoading(true)
    setError(null)
    loadModel()
      .then(() => navigate("/game"))
      .catch((e: Error) => {
        setError(e.message)
        setLoading(false)
      })
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">UX Quest</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Train yourself to spot UX problems. Examine 10 mini-applications,
            identify the flaw in each one, and test your score.
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600">Model loading error: {error}</p>
        )}
        <Button size="lg" onClick={handleStart} disabled={loading}>
          {loading ? "Loading model..." : "Start Training"}
        </Button>
      </div>
    </div>
  )
}
