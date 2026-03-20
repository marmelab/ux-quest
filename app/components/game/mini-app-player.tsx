import { Badge } from "~/components/ui/badge"
import type { Difficulty, MiniAppDefinition } from "~/lib/types"

interface MiniAppPlayerProps {
  miniApp: MiniAppDefinition
  disabled?: boolean
}

const difficultyVariant: Record<Difficulty, "default" | "secondary" | "destructive"> = {
  easy: "secondary",
  medium: "default",
  hard: "destructive",
}

export function MiniAppPlayer({ miniApp, disabled }: MiniAppPlayerProps) {
  const Component = miniApp.component

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">{miniApp.name}</h2>
        <Badge variant="outline">{miniApp.category}</Badge>
        <Badge variant={difficultyVariant[miniApp.difficulty]}>
          {miniApp.difficulty}
        </Badge>
      </div>
      <div
        className={`border-border rounded-lg border p-4 ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <Component />
      </div>
    </div>
  )
}
