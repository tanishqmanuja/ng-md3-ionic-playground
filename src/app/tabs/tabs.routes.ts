import { Routes } from "@angular/router";
import TabsPage from "./tabs.page";

export const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "todos",
        loadComponent: () => import("../todo/feature/todos/todos.page"),
      },
      {
        path: "starred",
        loadComponent: () => import("../todo/feature/starred/starred.page"),
      },
      {
        path: "lab",
        loadComponent: () => import("../lab/feature/lab/lab.page"),
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/todos",
    pathMatch: "full",
  },
];

export default routes;
