import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock credentials ---
const VALID_EMAIL = "sarah.chen@acme.com"
const VALID_PASSWORD = "password123"

type Page = "login" | "signup" | "forgot-password" | "dashboard"

// --- Shared header ---
function AppLogo() {
  return (
    <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
      A
    </div>
  )
}

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

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLogin(email)
      } else {
        // BUG: Form fields are cleared on failed login, forcing users to retype everything
        setEmail("")
        setPassword("")
        setErrors({ form: "Invalid email or password. Please try again." })
      }
    }, 800)
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-4">
      <div className="text-center">
        <AppLogo />
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Acme account
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-4"
      >
        {errors.form && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
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
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
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

        <Button
          type="submit"
          className="order-4 mt-1 w-full"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <a
          href="#"
          className="order-3 -mt-2.5 self-end text-xs text-muted-foreground underline hover:text-foreground"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("forgot-password")
          }}
        >
          Forgot password?
        </a>
      </form>

      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a
          href="#"
          className="font-medium text-foreground underline"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("signup")
          }}
        >
          Sign up
        </a>
      </p>
    </div>
  )
}

// --- Sign Up Page ---
function SignUpPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function validate() {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}
    if (!name.trim()) {
      newErrors.name = "Full name is required"
    }
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (email === VALID_EMAIL) {
      newErrors.email = "An account with this email already exists"
    }
    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      setSent(true)
    }, 800)
  }

  if (sent) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-green-100 text-lg">
            ✉
          </div>
          <h1 className="text-xl font-semibold">Verify your email</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>. Please
            click the link in the email to activate your account.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the email?
          <br />
          Check your spam folder or{" "}
          <a
            href="#"
            className="font-medium text-foreground underline"
            onClick={(e) => {
              e.preventDefault()
              setSent(false)
            }}
          >
            try again
          </a>
          .
        </p>

        <a
          href="#"
          className="text-sm font-medium text-muted-foreground underline hover:text-foreground"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("login")
          }}
        >
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-4">
      <div className="text-center">
        <AppLogo />
        <h1 className="text-xl font-semibold">Create an account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started with Acme today
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-name">
            Full name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
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
          <Label htmlFor="signup-password">
            Password <span className="text-destructive">*</span>
          </Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-confirm">
            Confirm password <span className="text-destructive">*</span>
          </Label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
            }}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="mt-1 w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <a
          href="#"
          className="font-medium text-foreground underline"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("login")
          }}
        >
          Sign in
        </a>
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
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-green-100 text-lg">
            ✓
          </div>
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the email?
          <br />
          Check your spam folder or{" "}
          <a
            href="#"
            className="font-medium text-foreground underline"
            onClick={(e) => {
              e.preventDefault()
              setSent(false)
            }}
          >
            try again
          </a>
          .
        </p>

        <a
          href="#"
          className="text-sm font-medium text-muted-foreground underline hover:text-foreground"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("login")
          }}
        >
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-4">
      <div className="text-center">
        <AppLogo />
        <h1 className="text-xl font-semibold">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null)
            }}
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <a
        href="#"
        className="text-sm font-medium text-foreground underline"
        onClick={(e) => {
          e.preventDefault()
          onNavigate("login")
        }}
      >
        Back to sign in
      </a>
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
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{email}</p>
            <p className="text-xs text-muted-foreground">Acme Inc.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          Log out
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome! Your account is ready. Content will appear here soon.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Projects", value: "0" },
          { label: "Tasks", value: "0" },
          { label: "Messages", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border p-3 text-center">
            <p className="text-xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main component ---
function LoginForm() {
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
    case "signup":
      return (
        <div className="p-4">
          <SignUpPage onNavigate={setPage} />
        </div>
      )
    case "forgot-password":
      return (
        <div className="p-4">
          <ForgotPasswordPage onNavigate={setPage} />
        </div>
      )
    case "dashboard":
      return (
        <div className="p-4">
          <DashboardPage email={userEmail} onLogout={handleLogout} />
        </div>
      )
    default:
      return (
        <div className="p-4">
          <LoginPage onLogin={handleLogin} onNavigate={setPage} />
        </div>
      )
  }
}

// --- Definition export ---
export const loginForm: MiniAppDefinition = {
  id: "login-form",
  name: "Login Form",
  introduction:
    "The classic sign in / sign up flow. Valid credentials: sarah.chen@acme.com / password123.",
  category: "security",
  difficulty: "hard",
  component: LoginForm,
  expectedAnswers: [
    "When login fails, the form fields are cleared, forcing the user to retype their email and password.",
    "The form empties both the email and password fields after a failed login attempt.",
    "On incorrect credentials, the input fields are reset so the user has to re-enter everything from scratch.",
    "After a failed login, the email and password are wiped, which is frustrating because users have to type them again.",
    "The form clears all entered data when the credentials are wrong, instead of keeping the email so the user can just fix the password.",
    "Failed login attempts erase the form inputs, making users retype their credentials entirely.",
    "The login error message appears but the form is emptied, so users lose what they typed.",
    "Both fields are reset on authentication failure instead of preserving the email address.",
    "When I enter the wrong email and password combination, the input fields clear, but they shouldn't.",
  ],
  hint: "What happens when you enter wrong credentials?",
  wrongAnswers: [
    "The password is not masked or hidden.",
    "There is no rate limiting or lockout after multiple failed attempts.",
    "The error message reveals whether the email or password is wrong.",
    "The loading spinner is too short or not visible enough.",
    "There is no remember me checkbox.",
    "There is no show/hide password toggle.",
    "The login form doesn't support social sign-in options like Google or GitHub.",
    "There is no password strength indicator on the sign-up form.",
    "The dashboard has no content or navigation after logging in.",
    "There is no option to stay signed in across sessions.",
    "The sign-up form doesn't confirm the email is unique in real time.",
    "There is no CAPTCHA or bot protection on the login form.",
    "The forgot password flow doesn't let you set a new password directly.",
    "There is no two-factor authentication option.",
  ],
}
