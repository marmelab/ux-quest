# UX Quest

UX Quest is a UX problem detection training game. Users examine mini-applications, identify the deliberate UX flaw in each, and describe it in text. An in-browser ML model scores answers via semantic similarity.

Play the game at [https://marmelab.com/ux-quest/](https://marmelab.com/ux-quest/).

<img width="1084" height="542" alt="ux-quest" src="https://github.com/user-attachments/assets/6a875001-476e-48b8-aa2f-e5b4a330ecb8" />

## Motivation

Developers sometimes struggle to identify UX problems in their own work. The problem is becoming more pressing as coding agents take on more of the implementation work, but fail to address usability issues.

A long time ago, François stumbled upon [Can't Unsee](https://cantunsee.space/), an in-browser design problem detection game. He found it was a fun way to improve his design skills. He imagined a similar game for UX, where user interaction is key, to help train his colleagues. However, building such a game proved difficult at the time.

This changed with AI coding tools and transformers. Not only did the cost of building mini-apps rapidly decrease, but scoring user answers became feasible with an in-browser ML model.

## Installation

This is a React single-page application (SPA) using Vite and React. To run it locally, you'll need Node.js installed. Then, simply run:

```bash
npm install
npm run dev
```

Then open [http://localhost:5173/](http://localhost:5173/).

## Docker

To build and run the app in a Docker container:

```bash
docker build -t ux-quest .
docker run -p 3000:3000 ux-quest
```

Then open [http://localhost:3000/ux-quest/](http://localhost:3000/ux-quest/).

## Contributing

If you have an idea for a mini-app or want to help with development, that's awesome!

A mini-app is a single-file React component that demonstrates a specific UX problem. It should be placed in the `app/mini-apps` directory and export a `MiniAppDefinition` object with the following properties:

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

To keep the number of lines of code low, mini-apps can leverage Tailwind CSS, Shadcn/ui, Lucide icons, and React-router, all of which are already installed.

You can use the `create-mini-app` skill to help you build a mini-app.

Mini apps must have one and only one UX flaw. The goal is for users to identify that flaw, so it should be clear enough to be identifiable but not so obvious that it's trivial.

You can test a mini-app by running the development server with `npm run dev` and navigating to `http://localhost:5173/mini-apps/{id}`, replacing `{id}` with your mini-app's name (e.g. `editable-profile` for the `app/mini-apps/editable-profile.tsx` file).

Make sure that typescript and formatting checks pass before submitting a PR. You can run these checks with:

```bash
npm run typecheck
npm run format
```

## License

This project is licensed under the MIT License, courtesy of [Marmelab](https://marmelab.com/). See the [LICENSE](LICENSE) file for details.
