---
name: create-mini-app
description: Create a new mini-app for the UX Quest UX problem detection game. Use this skill whenever the user asks to add a mini-app, create a new challenge, build a new exercise, or add a UX problem scenario to the game. Also trigger when the user says things like "let's add a new one", "create another mini-app", "new challenge", or describes a UI they want to turn into a mini-app with a deliberate flaw.
---

# Create Mini-App

You are creating a new mini-app for UX Quest, a UX problem detection training game. Users examine mini-applications, spot the ONE deliberate UX flaw, and describe it in text. An ML model scores their answer via semantic similarity.

## Before you start

1. Read the template to understand the structure:
   - `app/mini-apps/_template.tsx`

2. Read the barrel file to see existing registrations:
   - `app/mini-apps/index.ts`

3. Read 1-2 existing mini-apps to calibrate quality. Pick from:
   - `app/mini-apps/editable-profile.tsx` — forms, font mismatch bug
   - `app/mini-apps/product-table.tsx` — lists, pagination bug
   - `app/mini-apps/product-table-bulk-delete.tsx` — lists, tiny click targets
   - `app/mini-apps/product-form-collapsible.tsx` — forms, hidden validation errors
   - `app/mini-apps/monitoring-dashboard.tsx` — dataviz, low contrast
   - `app/mini-apps/bookstore-admin.tsx` — multi-view CRUD with Routes/Outlet, dark mode toast contrast bug

4. Check available shadcn/ui components:
   - `app/components/ui/` — see what's already installed
   - Install new ones with `npx shadcn@latest add <component>` if needed

5. If the user hasn't described what they want, ask them. If they have (even loosely — like reference images or a vague idea), proceed.

## The MiniAppDefinition type

```typescript
interface MiniAppDefinition {
  id: string                    // kebab-case, e.g. "monitoring-dashboard"
  name: string                  // display name, e.g. "Equipment Monitor"
  introduction: string          // 1-2 sentences explaining what the mini-app is
  category: Category            // "navigation" | "forms" | "feedback" | "accessibility" | "layout" | "interaction" | "lists" | "dataviz"
  difficulty: Difficulty        // "easy" | "medium" | "hard"
  component: ComponentType      // the React component
  expectedAnswers: string[]     // 6-10 phrasings of the correct UX flaw
  wrongAnswers?: string[]       // 5-6 plausible but incorrect answers
}
```

## Writing the component

### File structure

Create a single file in `app/mini-apps/` named after the mini-app (kebab-case, e.g. `monitoring-dashboard.tsx`). Everything lives in this one file:

```typescript
import { useState } from "react"
import type { MiniAppDefinition } from "~/lib/types"
// import shadcn/ui components as needed from "~/components/ui/..."

// --- Mock data (interfaces + constants) ---

// --- Sub-components (visualizations, cards, etc.) ---

// --- Main component ---
function MyMiniApp() {
  return ( /* ... */ )
}

// --- Definition export ---
export const myMiniApp: MiniAppDefinition = {
  id: "my-mini-app",
  name: "My Mini App",
  // ...
}
```

### Quality bar

The mini-app must look and feel like a real product UI — not a toy example. Think: a settings page, a dashboard, a checkout flow, a data table, a form wizard, a notification center. Users should believe this could be a real app.

- Use realistic mock data (names, prices, dates, metrics — not "lorem ipsum")
- Polish spacing, typography, and visual hierarchy
- Make interactions work properly (clicks, hover states, form validation)
- Use shadcn/ui components for consistency with the project's design system
- Path alias: `~/` maps to `./app/`

### The deliberate UX flaw

This is the core of the game. The mini-app must have exactly ONE deliberate UX problem. The flaw should be:

- **Subtle enough** to be a challenge — not immediately obvious, but noticeable when you interact with the app or look carefully
- **The only issue** — the rest of the UI must be clean and well-designed. If there are unintended UX issues, fix them
- **A real UX anti-pattern** — something that actually happens in production apps

Mark the flaw with a `// BUG:` comment in the code explaining what it is.

**Good flaw examples** (from existing mini-apps):
- Font style changes between display and edit mode (visual inconsistency)
- Pagination doesn't reset when filters change (state management)
- Checkbox click targets are too small (accessibility/interaction)
- Validation errors hidden inside collapsed sections (information visibility)
- Low contrast text on dark backgrounds (accessibility/readability)

**Other flaw ideas:**
- Destructive action button styled like a primary/safe action
- Toast notification that disappears too quickly to read
- Ambiguous icon that means different things in different contexts
- Sort order indicator pointing the wrong direction
- Disabled button with no explanation of why it's disabled
- Required field indicator that's too subtle to notice
- Modal that can't be dismissed by clicking outside or pressing Escape
- Search that doesn't debounce (results flash on every keystroke)
- Confirmation dialog with "Yes/No" instead of descriptive action labels
- Progress indicator that doesn't reflect actual progress

### Multi-view mini-apps (routing)

For mini-apps with multiple views (e.g. list → detail → edit), use React Router's `<Routes>` and `<Outlet>` instead of search params or manual state switching. The parent routes (`game/*` and `mini-app/:id/*`) already have `/*` wildcards to support this.

**Pattern** (see `bookstore-admin.tsx` for a full example):

1. **Store context**: Create a context to share state (data, setters, toast) across route components.

2. **Layout route with `<Outlet>`**: Use a layout route for shared chrome (breadcrumbs, section headers) that renders `<Outlet />` for child content:
   ```tsx
   <Routes>
     <Route index element={<Navigate to="items" replace />} />
     <Route path="items/*" element={<SectionLayout />}>
       <Route index element={<ItemsList />} />
       <Route path="new" element={<ItemCreate />} />
       <Route path=":id" element={<ItemShow />} />
       <Route path=":id/edit" element={<ItemEdit />} />
     </Route>
   </Routes>
   ```

3. **Absolute navigation via basePath**: Compute a `basePath` from `useParams` and `useLocation` in the root component, store it in the context, and use it for all navigation links (sidebar, breadcrumbs, post-save redirects):
   ```tsx
   const { "*": splat = "" } = useParams()
   const location = useLocation()
   const basePath = splat
     ? location.pathname.slice(0, -splat.length).replace(/\/$/, "")
     : location.pathname.replace(/\/$/, "")
   // Then: nav(`${basePath}/items/${id}`)
   ```

4. **Route components use context**: Each route component calls `useStore()` for data and `useNavigate()` for navigation — no prop drilling needed.

5. **Edit pages own their form state**: Initialize `formData` from the store based on `useParams()` `:id`, rather than requiring the caller to pre-populate state before navigating.

6. **Use `<form>` elements**: Form pages should use `<form onSubmit>` with `type="submit"` buttons so browser form mechanics (submit on Enter) work. Cancel buttons need `type="button"`.

### Rendering context

Mini-apps render inside a wrapper card (`rounded-lg border p-4` in game, `rounded-lg border p-6` in preview). Don't add an extra outer card — your component is already inside one. If your mini-app has a dark/custom background, you may use negative margins to fill the wrapper edge-to-edge.

### Expected and wrong answers

**expectedAnswers** (6-10 entries): Different phrasings of the same correct UX flaw. These are compared to the user's answer via semantic similarity (cosine similarity with threshold 0.65). Cover:
- Short and direct descriptions
- Longer, more detailed explanations
- Descriptions from different angles (visual, functional, accessibility)

**wrongAnswers** (5-6 entries): Plausible observations that are NOT the deliberate flaw. These help the ML model reject answers that are topically similar but incorrect. Think about what someone might say if they're looking in the wrong direction.

## Registering the mini-app

After creating the file, add it to `app/mini-apps/index.ts`:

```typescript
import { myMiniApp } from "./my-mini-app"

export const miniApps: MiniAppDefinition[] = [
  // ... existing entries
  myMiniApp,
  // Add new mini-app definitions here  ← keep this comment at the end
]
```

## Verification

After creating the mini-app:

1. Start the dev server if not running (`npm run dev`)
2. Navigate to `/mini-app/{id}` in the preview browser
3. Take a screenshot to verify it renders correctly
4. Interact with the mini-app (click tabs, fill forms, etc.) to verify functionality
5. Specifically check that the deliberate UX flaw is present and noticeable
6. Check that there are no unintended UX issues — if you spot any, fix them
7. Share the screenshot with the user for feedback

## Iterating with the user

The user will likely want to adjust things after seeing the first version. Common requests:
- Tweak the visual design (colors, spacing, typography)
- Make the flaw more or less subtle
- Add more interactivity or data
- Change the category or difficulty
- Adjust expected/wrong answers

When the user provides reference images, use them as inspiration for the visual style but don't try to replicate them pixel-for-pixel. Extract the mood, color palette, layout pattern, and level of complexity.
