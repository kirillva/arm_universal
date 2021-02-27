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
    path: "/address",
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
    path: "/street",
    title: "II этап: подтверждение",
  }
];
