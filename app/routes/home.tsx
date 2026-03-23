import { Monitor } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Footer } from "~/components/footer"
import { Button } from "~/components/ui/button"
import { useIsMobile } from "~/hooks/use-mobile"
import { isModelReady, loadModel } from "~/lib/semantic-similarity.client"

export default function Home() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Preload model in the background — only on desktop
  useEffect(() => {
    if (isMobile === false) {
      loadModel().catch(() => {})
    }
  }, [isMobile])

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

  // Wait for client-side check before rendering
  if (isMobile === undefined) {
    return null
  }

  if (isMobile) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-xs flex-col items-center gap-4 text-center">
          <Monitor className="size-10 text-muted-foreground" />
          <h1 className="text-xl font-bold">Desktop Only</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            UX Quest requires a larger screen to display the mini-applications
            properly. Please open this site on a desktop or laptop computer.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <img src="/ux-quest.webp" alt="UX Quest" className="w-48" />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">UX Quest</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Examine mini-applications,
              <br />
              identify the UX flaw in each one,
              <br />
              and train yourself to spot them in the wild!
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
      <Footer />
    </>
  )
}
