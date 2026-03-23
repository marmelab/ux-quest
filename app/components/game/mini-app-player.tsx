import { RotateCcw } from "lucide-react"
import { useCallback, useState } from "react"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import type { Difficulty, MiniAppDefinition } from "~/lib/types"

interface MiniAppPlayerProps {
  miniApp: MiniAppDefinition
}

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-emerald-500 text-white",
  medium: "bg-amber-500 text-white",
  hard: "bg-red-500 text-white",
}

export function MiniAppPlayer({ miniApp }: MiniAppPlayerProps) {
  const Component = miniApp.component
  const [resetKey, setResetKey] = useState(0)

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">{miniApp.name}</h2>
          <Badge className={difficultyColors[miniApp.difficulty]}>
            {miniApp.difficulty}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleReset}
            title="Reset mini-app"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{miniApp.introduction}</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Component key={resetKey} />
      </div>
    </div>
  )
}
