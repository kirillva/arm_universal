import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';

export const menuItems = [
  {
    claims: [
      "manual_edit",
      "admin",
      "food_kit",
      "manager_candidate",
      "division",
    ],
    icon: HomeIcon,
    path: "/part1",
    title: "I этап: привязка домов",
  },
  {
    claims: [
      "manual_edit",
      "admin",
      "food_kit",
      "manager_candidate",
      "division",
    ],
    icon: AssignmentIcon,
    path: "/part2",
    title: "II этап: подтверждение",
  },
  {
    claims: [
      "manual_edit",
      "admin",
      "food_kit",
      "manager_candidate",
      "division",
    ],
    icon: AssignmentIcon,
    path: "/part3",
    title: "III этап: добавление",
  }
];
