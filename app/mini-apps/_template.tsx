import type { MiniAppDefinition } from "~/lib/types"

/**
 * Template for creating a new mini-app.
 *
 * To create a new mini-app:
 * 1. Copy this file and rename it (e.g., `confusing-back-button.tsx`)
 * 2. Implement the component with a deliberate UX problem
 * 3. Fill in the definition with metadata and the expected answer
 * 4. Add the import and definition to `index.ts`
 */
function TemplateMiniApp() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-medium">Example Mini-App</h2>
      <p>
        This is a template. Replace this with a UI that contains a UX problem.
      </p>
    </div>
  )
}

export const templateMiniApp: MiniAppDefinition = {
  id: "template",
  name: "Template",
  introduction: "Describe what this mini-app is about.",
  category: "interaction",
  difficulty: "easy",
  component: TemplateMiniApp,
  expectedAnswers: ["Describe the UX problem here"],
  wrongAnswers: ["Describe a plausible but incorrect UX problem here"],
}
