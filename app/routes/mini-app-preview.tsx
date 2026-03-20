import { useParams } from "react-router"
import { miniApps } from "~/mini-apps"

export default function MiniAppPreviewRoute() {
  const { id } = useParams<{ id: string }>()
  const miniApp = miniApps.find((m) => m.id === id)

  if (!miniApp) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Mini-app <code>{id}</code> not found.
        </p>
      </div>
    )
  }

  const Component = miniApp.component

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-1 text-lg font-semibold">{miniApp.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{miniApp.introduction}</p>
      <div className="rounded-lg border p-6">
        <Component />
      </div>
    </div>
  )
}
