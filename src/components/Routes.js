import { AdminPanel } from "pages/AdminPanel";

export const routeItems = [
  {
    claims: ["manager"],
    exact: true,
    path: "/admin_panel",
    component: AdminPanel,
  },
];
