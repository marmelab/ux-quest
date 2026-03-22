import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-muted-foreground">
      <a
        href="https://github.com/marmelab/ux-quest"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <Github className="h-4 w-4" />
        Star us on GitHub
      </a>
    </footer>
  )
}
