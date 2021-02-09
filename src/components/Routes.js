// import { ScanPanel } from "pages/ScanPanel";
import { ResultPanel } from "pages/ResultPanel";
import { SigninForm } from "pages/SigninForm";
import { AddressPanel } from "pages/AddressPanel";
import { RoutesPanel } from "pages/RoutesPanel";
import { AdminPanel } from "pages/AdminPanel";
import { VotersPanel } from "pages/VotersPanel";

export const routeItems = [
  {
    claims: ["manager"],
    exact: true,
    public: true,
    path: "/auth",
    component: SigninForm,
  },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/",
  //   component: RoutesPanel,
  // },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/result",
  //   component: ResultPanel,
  // },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/routes",
  //   component: RoutesPanel,
  // },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/result",
  //   component: ResultPanel,
  // },
  {
    claims: ["manager"],
    exact: true,
    path: "/",
    component: AdminPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/address",
    component: AddressPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/voters",
    component: VotersPanel,
  }
];
