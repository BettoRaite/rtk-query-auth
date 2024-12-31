import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),
  route("login", "./pages/login.tsx"),
  route("signup", "./pages/signup.tsx"),
  // pattern ^           ^ module file
] satisfies RouteConfig;
