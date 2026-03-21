import { Badge } from "~/components/ui/badge"
import type { Difficulty, MiniAppDefinition } from "~/lib/types"

interface MiniAppPlayerProps {
  miniApp: MiniAppDefinition
}

const difficultyVariant: Record<
  Difficulty,
  "default" | "secondary" | "destructive"
> = {
  easy: "secondary",
  medium: "default",
  hard: "destructive",
}

export function MiniAppPlayer({ miniApp }: MiniAppPlayerProps) {
  const Component = miniApp.component

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">{miniApp.name}</h2>
          <Badge variant={difficultyVariant[miniApp.difficulty]}>
            {miniApp.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{miniApp.introduction}</p>
      </div>
      <div className="rounded-lg border border-border p-4">
        <Component />
      </div>
    </div>
  )
}
