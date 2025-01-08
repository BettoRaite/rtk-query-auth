import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./pages/layout.tsx", [
    index("./pages/home.page.tsx"),
    route("login", "./pages/login.page.tsx"),
    route("signup", "./pages/signup.page.tsx"),
    route("dashboard", "./pages/dashboard.page.tsx"),
  ]),
] satisfies RouteConfig;
