import { Routes } from "@angular/router";
import TabsPage from "./tabs.page";

export const routes: Routes = [
	{
		path: "tabs",
		component: TabsPage,
		children: [
			{
				path: "todo",
				loadComponent: () => import("../todo/feature/todo/todo.page")
			},
			{
				path: "starred",
				loadComponent: () => import("../todo/feature/starred/starred.page")
			},
			{
				path: "lab",
				loadComponent: () => import("../lab/feature/lab/lab.page")
			}
		],
	},{
		path: "",
		redirectTo: "/tabs/todo",
		pathMatch: "full"
	},
];

export default routes;