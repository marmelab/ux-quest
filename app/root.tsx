import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router"

import type { Route } from "./+types/root"
import "./app.css"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="UX Quest - Train Your Usability Skills"
        />
        <meta
          property="og:description"
          content="A usability problem detection training game"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marmelab.com/ux-quest/" />
        <meta
          property="og:image"
          content="https://marmelab.com/ux-quest/og-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://marmelab.com/ux-quest/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="UX Quest" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <script
          defer
          src="https://gursikso.marmelab.com/script.js"
          data-website-id="ec47274a-7636-4b10-928b-e7cf26282344"
        ></script>
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
