import { AdminPanel } from "pages/AdminPanel";

export const routeItems = [
  {
    claims: ["manager"],
    exact: true,
    path: "/scan",
    component: AdminPanel,
  },
];
