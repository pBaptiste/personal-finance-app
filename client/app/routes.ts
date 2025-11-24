import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  layout("routes/_layout.tsx", [
    index("routes/home.tsx"),
    route("/transactions", "routes/transactions.tsx"),
    route("/budget", "routes/budget.tsx"),
    route("/pots", "routes/pots.tsx"),
    route("/recurring", "routes/recurring.tsx"),
  ])
] satisfies RouteConfig;
