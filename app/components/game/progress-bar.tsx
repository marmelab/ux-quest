import { Progress, ProgressLabel } from "~/components/ui/progress"

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <Progress value={percentage}>
      <ProgressLabel>
        Question {current} / {total}
      </ProgressLabel>
    </Progress>
  )
}
