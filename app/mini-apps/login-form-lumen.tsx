import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock credentials ---
const VALID_EMAIL = "jamie.lee@lumenwork.io"
const VALID_PASSWORD = "brightpass7"

type Page = "login" | "dashboard"

// --- Login Page ---
function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    form?: string
  }>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!password.trim()) {
      newErrors.password = "Password is required"
    }
    return newErrors
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLogin(email)
      } else {
        setErrors({ form: "Invalid email or password. Please try again." })
      }
    }, 800)
  }

  function blockPaste(e: React.ClipboardEvent) {
    e.preventDefault()
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-8 py-6">
      <div className="flex flex-col gap-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-teal-600 text-sm font-bold text-white">
            L
          </div>
          <span className="text-sm font-semibold tracking-tight">Lumen</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Lumen workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lumen-email">Email address</Label>
          <Input
            id="lumen-email"
            type="email"
            autoComplete="email"
            placeholder="jane.doe@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            onPaste={blockPaste}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lumen-password">Password</Label>
          <Input
            id="lumen-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            onPaste={blockPaste}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-2 w-full bg-teal-600 hover:bg-teal-700"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
}

// --- Dashboard Page ---
function DashboardPage({
  onLogout,
  email,
}: {
  onLogout: () => void
  email: string
}) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-teal-600 text-sm font-bold text-white">
            L
          </div>
          <span className="text-sm font-semibold tracking-tight">Lumen</span>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          Sign out
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <h2 className="mt-2 text-lg font-semibold">Your workspace is ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your projects and tasks will appear here.
        </p>
      </div>
    </div>
  )
}

// --- Main component ---
function LoginFormLumen() {
  const [page, setPage] = useState<Page>("login")
  const [userEmail, setUserEmail] = useState("")

  function handleLogin(email: string) {
    setUserEmail(email)
    setPage("dashboard")
  }

  function handleLogout() {
    setPage("login")
    setUserEmail("")
  }

  if (page === "dashboard") {
    return (
      <div className="p-4">
        <DashboardPage email={userEmail} onLogout={handleLogout} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <LoginPage onLogin={handleLogin} />
    </div>
  )
}

// --- Definition export ---
export const loginFormLumen: MiniAppDefinition = {
  id: "login-form-lumen",
  name: "Workspace Sign-In",
  introduction:
    "A login page. Valid credentials: jamie.lee@lumenwork.io / brightpass7.",
  category: "interaction",
  difficulty: "easy",
  component: LoginFormLumen,
  expectedAnswers: [
    "Pasting is disabled in the email and password fields, forcing users to type credentials manually.",
    "You cannot paste into the login form inputs, which prevents using a password manager.",
    "The copy/paste functionality is disabled.",
    "The form blocks paste on the email and password inputs, making it harder to use saved credentials.",
    "Paste is blocked in the email and password fields, which is frustrating for users who copy credentials from a password manager.",
    "The input fields prevent pasting, so users cannot paste their email or password from the clipboard.",
    "Clipboard paste is disabled on the form fields, breaking the expected paste workflow.",
    "The login form disables pasting, which hurts usability and discourages password manager usage.",
    "Can't paste my password from my password manager.",
    "Ctrl+V doesn't work in the input fields.",
    "The form prevents pasting, which breaks password manager workflows.",
    "Right-click paste and keyboard paste are both blocked on the fields.",
    "I tried to paste my credentials but the fields won't accept pasted text.",
    "Paste is disabled — really annoying for users with long passwords stored in a manager.",
    "I can't use my password manager with this form.",
    "Paste doesn't work on the inputs.",
    "The form blocks clipboard operations.",
  ],
  hint: "Try pasting the login and password into the form fields.",
  wrongAnswers: [
    "There is no forgot password link.",
    "The password field has no show/hide toggle.",
    "There is no remember me checkbox.",
    "The error message doesn't specify whether the email or password is wrong.",
    "There is no sign up option or account creation link.",
    "There is no social login option like Google or GitHub.",
  ],
}
