// import { ScanPanel } from "pages/ScanPanel";
import { ResultPanel } from "pages/ResultPanel";
import { SigninForm } from "pages/SigninForm";
import { AddressPanel } from "pages/address/AddressPanel";
import { RoutesPanel } from "pages/RoutesPanel";
import { AdminPanel } from "pages/AdminPanel";
import { VotersList } from "pages/VotersList";
import { StreetDetailTable } from "pages/address/StreetDetailTable";
import { VoterSearchForm } from "pages/VoterSearchForm";
import { HouseHistoryPanel } from "pages/HouseHistoryPanel";

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
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/",
  //   component: AddressPanel,
  // },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/voters",
  //   component: VoterSearchForm,
  // },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/votersList",
  //   component: VotersList,
  // },
  {
    claims: ["manager"],
    exact: false,
    path: "/address",
    component: HouseHistoryPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/",
    component: AddressPanel,
  },
  {
    claims: ["manager"],
    exact: false,
    path: "/street/detail",
    component: StreetDetailTable,
  },
];
