import { SigninForm } from "pages/SigninForm";
import { Part1 } from "pages/address/Part1";
import { Part2 } from "pages/address/Part2";
import { Part3StreetTable } from "pages/address/Part3StreetTable";
import { VotersList } from "pages/VotersList";
import { VoterSearchForm } from "pages/VoterSearchForm";

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
    component: VotersList,
  },
  {
    claims: ["manager"],
    exact: true,
    path: "/voters",
    component: VoterSearchForm,
  },
];
