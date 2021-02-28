import { SigninForm } from "pages/SigninForm";
import { Part2 } from "pages/address/Part2";
import { Part1 } from "pages/address/Part1";

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
    path: "/part3",
    component: Part2,
  },
];
