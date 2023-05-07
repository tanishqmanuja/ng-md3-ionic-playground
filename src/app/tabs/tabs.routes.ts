import { Routes } from "@angular/router";
import TabsPage from "./tabs.page";

export const routes: Routes = [
	{
		path: "tabs",
		component: TabsPage,
		children: [
			{
				path: "tab1",
				loadComponent: () => import("./tab1/tab1.page")
			},
			{
				path: "tab2",
				loadComponent: () => import("./tab2/tab2.page")
			},
			{
				path: "tab3",
				loadComponent: () => import("./tab3/tab3.page")
			}
		],
	},{
		path: "",
		redirectTo: "/tabs/tab1",
		pathMatch: "full"
	},
];

export default routes;