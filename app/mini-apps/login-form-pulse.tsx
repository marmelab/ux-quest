import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock credentials ---
const VALID_EMAIL = "alex.morgan@pulseapp.io"
const VALID_PASSWORD = "securepass1"

type Page = "login" | "forgot-password" | "dashboard"

// --- Login Page ---
function LoginPage({
  onLogin,
  onNavigate,
}: {
  onLogin: (email: string) => void
  onNavigate: (page: Page) => void
}) {
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

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-8 py-6">
      <div className="flex flex-col gap-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-violet-600 text-sm font-bold text-white">
            P
          </div>
          <span className="text-sm font-semibold tracking-tight">Pulse</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to continue to your workspace
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {errors.form && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pulse-email">Email address</Label>
          <Input
            id="pulse-email"
            type="email"
            autoComplete="email"
            placeholder="alex@pulseapp.io"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pulse-password">Password</Label>
          <Input
            id="pulse-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        {/* BUG: This link is between the password input and the submit button
            in the DOM, so it sits in the natural tab order. A keyboard user
            who tabs past the password field lands on this link instead of
            the submit button. Pressing Enter then navigates to the forgot
            password page instead of submitting the form. */}
        <a
          href="#"
          className="-mt-2 self-end text-xs text-muted-foreground hover:text-violet-600 hover:underline"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("forgot-password")
          }}
        >
          Forgot password?
        </a>

        <Button
          type="submit"
          className="mt-2 w-full bg-violet-600 hover:bg-violet-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By logging in you agree to our Terms and Privacy Policy.
      </p>
    </div>
  )
}

// --- Forgot Password Page ---
function ForgotPasswordPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError(null)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  if (sent) {
    return (
      <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-6 py-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-violet-100 text-lg text-violet-600">
            ✓
          </div>
          <h1 className="text-xl font-bold">Check your inbox</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Didn't get the email? Check spam or{" "}
          <a
            href="#"
            className="font-medium text-violet-600 underline"
            onClick={(e) => {
              e.preventDefault()
              setSent(false)
            }}
          >
            try again
          </a>
          .
        </p>

        <button
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => onNavigate("login")}
        >
          <ArrowLeft className="size-3.5" />
          Back to login
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-8 py-6">
      <div className="flex flex-col gap-1">
        <button
          className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => onNavigate("login")}
        >
          <ArrowLeft className="size-3.5" />
          Back to login
        </button>
        <h1 className="text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pulse-forgot-email">Email address</Label>
          <Input
            id="pulse-forgot-email"
            type="email"
            placeholder="alex@pulseapp.io"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null)
            }}
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send reset link"}
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
          <div className="flex size-8 items-center justify-center rounded-md bg-violet-600 text-sm font-bold text-white">
            P
          </div>
          <span className="text-sm font-semibold tracking-tight">Pulse</span>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          Log out
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <h2 className="mt-2 text-lg font-semibold">Your workspace is ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Projects and tasks will appear here.
        </p>
      </div>
    </div>
  )
}

// --- Main component ---
function LoginFormPulse() {
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

  switch (page) {
    case "forgot-password":
      return <ForgotPasswordPage onNavigate={setPage} />
    case "dashboard":
      return <DashboardPage email={userEmail} onLogout={handleLogout} />
    default:
      return <LoginPage onLogin={handleLogin} onNavigate={setPage} />
  }
}

// --- Definition export ---
export const loginFormPulse: MiniAppDefinition = {
  id: "login-form-pulse",
  name: "Workspace Login",
  introduction:
    "A simple login page for a project management tool. Valid credentials: alex.morgan@pulseapp.io / securepass1.",
  category: "accessibility",
  difficulty: "hard",
  component: LoginFormPulse,
  expectedAnswers: [
    "The forgot password link is in the tab order between the password field and the submit button, so keyboard users land on it instead of the login button.",
    "Tab order is wrong: after the password input, pressing tab focuses the forgot password link instead of the submit button.",
    "The forgot password link intercepts keyboard navigation between the password field and the log in button.",
    "A keyboard user pressing tab after entering their password will focus the forgot password link, and pressing enter will navigate away instead of submitting the form.",
    "The tab order puts the forgot password link before the submit button, so pressing enter after tabbing past the password triggers a navigation instead of login.",
    "Keyboard users who tab from password and press enter accidentally go to the forgot password page instead of logging in.",
    "The forgot password link breaks the natural keyboard flow from password to the submit button.",
    "Tab index is not set on the forgot password link, so it appears in the tab order between the password input and the login button, disrupting keyboard navigation.",
  ],
  wrongAnswers: [
    "The form fields are cleared on failed login.",
    "There is no sign up option or account creation link.",
    "The password field has no show/hide toggle.",
    "There is no remember me checkbox.",
    "The error message doesn't specify whether the email or password is wrong.",
    "There is no social login option like Google or GitHub.",
  ],
}
