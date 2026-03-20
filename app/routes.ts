import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("game", "routes/game.tsx"),
  route("results", "routes/results.tsx"),
  route("mini-app/:id", "routes/mini-app-preview.tsx"),
] satisfies RouteConfig
