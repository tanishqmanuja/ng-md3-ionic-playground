import { NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

export type TabSchema = {
	routerPath: string;
	label: string;
	icon: string;
	iconActive: string;
	default?: boolean;
}

@Component({
	selector: "tabs-page",
	standalone: true,
	imports: [IonicModule,NgFor],
	template: `
	<ion-tabs>
		<ion-tab-bar slot="bottom">
		<ion-tab-button *ngFor="let t of tabs" tab="{{t.routerPath}}" #tabRef>
			<ion-icon [name]="tabRef.selected ? t.iconActive : t.icon"></ion-icon>
			<ion-label>{{t.label}}</ion-label>
		</ion-tab-button>
		</ion-tab-bar>
	</ion-tabs>`,
	styleUrls: ['tabs.page.scss']
})
export default class TabsPage {
	readonly tabs: TabSchema[] = [
		{
		  routerPath: 'tab1',
		  label: 'Label',
		  icon: 'ellipse-outline',
		  iconActive: 'ellipse',
		},
		{
		  routerPath: 'tab2',
		  label: 'Label',
		  icon: 'triangle-outline',
		  iconActive: 'triangle',
		  default: true,
		},
		{
		  routerPath: 'tab3',
		  label: 'Label',
		  icon: 'square-outline',
		  iconActive: 'square',
		},
	  ];
}