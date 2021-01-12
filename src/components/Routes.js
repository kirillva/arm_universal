import { ScanPanel } from "pages/ScanPanel";
import { ResultPanel } from "pages/ResultPanel";
import { SigninForm } from "pages/SigninForm";
import { TablePanel } from "pages/TablePanel";
import { FormPanel } from "pages/FormPanel";

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
  },
  {
    claims: ["manager"],
    exact: true,
    public: true,
    path: "/auth",
    component: SigninForm,
  },
  {
    claims: ["manager"],
    exact: true,
    public: true,
    path: "/table",
    component: TablePanel,
  },
  {
    claims: ["manager"],
    exact: true,
    public: true,
    path: "/form",
    component: FormPanel,
  }
];
