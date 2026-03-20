import { GameProvider } from "~/hooks/use-game"
import { GameSession } from "~/components/game/game-session"

export default function GameRoute() {
  return (
    <GameProvider>
      <GameSession />
    </GameProvider>
  )
}
