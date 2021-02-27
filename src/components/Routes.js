import { SigninForm } from "pages/SigninForm";
import { AddressPanel } from "pages/address/AddressPanel";
// import { HouseListTable } from "pages/address/HouseListTable";
import { HouseHistoryPanel } from "pages/HouseHistoryPanel";

export const routeItems = [
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
    path: "/address",
    component: HouseHistoryPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/street",
    component: AddressPanel,
  },
  // {
  //   claims: ["manager"],
  //   exact: true,
  //   path: "/street/detail",
  //   component: StreetDetailTable,
  // },
];
