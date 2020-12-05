import { ScanPanel } from "pages/ScanPanel";
import { ResultPanel } from "pages/ResultPanel";
import { SigninForm } from "pages/SigninForm";

export const routeItems = [
  {
    claims: ["manager"],
    exact: true,
    path: "/",
    component: ScanPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/result",
    component: ResultPanel,
  },{
    claims: ["manager"],
    exact: true,
    public: true,
    path: "/auth",
    component: SigninForm,
  }
];
