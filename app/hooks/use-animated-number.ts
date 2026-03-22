import { useEffect, useRef, useState } from "react"

/**
 * Animates a number from its previous value to the target using
 * an ease-out curve (starts fast, slows near the end).
 * Duration is capped at `maxDuration` ms.
 */
export function useAnimatedNumber(
  target: number,
  maxDuration = 2000
): number {
  const [display, setDisplay] = useState(target)
  const prevTarget = useRef(target)

  useEffect(() => {
    const from = prevTarget.current
    prevTarget.current = target

    if (from === target) return

    const diff = target - from
    if (diff === 0) return

    const start = performance.now()

    let rafId: number
    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / maxDuration, 1)
      // ease-out cubic: fast start, slow finish
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(from + diff * eased)
      setDisplay(current)

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [target, maxDuration])

  return display
}
