import { Link } from "react-router"
import { buttonVariants } from "~/components/ui/button"

export default function Home() {
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
        <Link to="/game" className={buttonVariants({ size: "lg" })}>
          Start Training
        </Link>
      </div>
    </div>
  )
}
