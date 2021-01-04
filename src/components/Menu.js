import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const menuItems = [
  // {
  //   claims: [
  //     "manual_edit",
  //     "admin",
  //     "food_kit",
  //     "manager_candidate",
  //     "division",
  //   ],
  //   icon: ArrowDownward,
  //   path: "/auth",
  //   title: "Авторизация",
  // },
  {
    claims: [
      "manual_edit",
      "admin",
      "food_kit",
      "manager_candidate",
      "division",
    ],
    icon: PhotoCameraIcon,
    path: "/",
    title: "Сканировать",
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
    path: "/result",
    title: "Результаты",
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
    path: "/table",
    title: "Таблица",
  }
];
