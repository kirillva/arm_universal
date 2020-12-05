import { ScanPanel } from "pages/ScanPanel";
import { ResultPanel } from "pages/ResultPanel";

export const routeItems = [
  {
    claims: ["manager"],
    exact: true,
    path: "/scan",
    component: ScanPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/result",
    component: ResultPanel,
  }
];
