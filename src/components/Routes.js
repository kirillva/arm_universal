import { SigninForm } from "pages/SigninForm";
import { Part1 } from "pages/address/Part1";
import { Part2 } from "pages/address/Part2";
import { Part3StreetTable } from "pages/address/Part3StreetTable";
import { Part3 } from "pages/address/Part3";
import { AssignUsers } from "pages/address/AssignUsers";
import { AssignDivisions } from "pages/address/AssignDivisions";
import { AdminPanel } from "pages/Admin/AdminPanel";
import { DocumentsPanel } from "pages/Documents/DocumentsPanel";

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
    path: "/part1",
    component: Part1,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/part2",
    component: Part2,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/part3edit",
    component: Part3StreetTable,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/part3",
    component: Part3,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/assignUsers",
    component: AssignUsers,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/assignDivisions",
    component: AssignDivisions,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/adminPanel",
    component: AdminPanel,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/documents",
    component: DocumentsPanel,
  }
];

