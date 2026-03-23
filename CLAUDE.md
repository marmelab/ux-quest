# CLAUDE.md

UX Quest is a UX problem detection training game. Users examine mini-applications, identify the deliberate UX flaw in each, and describe it in text. An in-browser ML model (transformers.js) scores answers via semantic similarity.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run typecheck` — run `react-router typegen && tsc`
- `npm run format` — format with Prettier

No test framework is configured yet.

### Game flow

Idle → Playing (interact with mini-app, submit answer) → Reviewing (show result) → next mini-app → Finished → Results page. Users get 3 attempts per mini-app. Scores pass from `/game` to `/results` via React Router navigation state.

### Key layers

- **Routes** (`app/routes.ts`): `/` (home), `/game` (session), `/results` (scoreboard), `/mini-app/:id` (preview).
- **Game state** (`app/hooks/use-game.tsx`): React Context + `useReducer`. `GameProvider` wraps the game route only. Actions: `START_GAME`, `SUBMIT_ATTEMPT`, `NEXT_MINI_APP`, `RESET`.
- **Semantic similarity** (`app/lib/semantic-similarity.client.ts`): Uses `Xenova/ms-marco-MiniLM-L-6-v2` via `@huggingface/transformers`. The `.client.ts` suffix excludes it from the SSR bundle. `computeBestSimilarity()` compares the user answer against all `expectedAnswers` variants and returns the best cosine similarity score. Threshold: 0.65.
- **Game UI** (`app/components/game/`): `game-session` orchestrates the flow; `mini-app-player`, `answer-input`, `answer-feedback`, `score-board`, `progress-bar` are presentational.

### Mini-app registry

Each mini-app is a file in `app/mini-apps/` that exports a `MiniAppDefinition` (id, name, category, difficulty, component, expectedAnswers, hint). The barrel `app/mini-apps/index.ts` collects them into an array. `app/lib/mini-app-registry.ts` provides helpers (`pickRandom`, `filterByCategory`, etc.).

To add a mini-app: copy `app/mini-apps/_template.tsx`, implement the component with one deliberate UX problem, provide multiple `expectedAnswers` phrasings, a `hint` that nudges the player without giving away the answer, and add the import to `index.ts`.

Mini-apps must not introduce unintended UX issues — the only flaw should be the deliberate one.

## Stack

- React Router 7 (SPA mode, SSR disabled), React 19, TypeScript, Vite
- Tailwind CSS 4 + shadcn/ui (base-nova style, Base UI primitives)
- Icons: use `lucide-react` — never write inline SVGs by hand
- Path alias: `~/` maps to `./app/`
- UI language: English
