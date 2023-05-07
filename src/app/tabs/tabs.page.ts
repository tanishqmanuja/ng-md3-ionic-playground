import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
	selector: "tabs-page",
	standalone: true,
	imports: [IonicModule],
	template: `
	<ion-tabs>
		<ion-tab-bar slot="bottom">
			<ion-tab-button tab="tab1">
				<ion-icon name="triangle"></ion-icon>
				<ion-label>Tab 1</ion-label>
			</ion-tab-button>

			<ion-tab-button tab="tab2">
				<ion-icon name="ellipse"></ion-icon>
				<ion-label>Tab 2</ion-label>
			</ion-tab-button>

			<ion-tab-button tab="tab3">
				<ion-icon name="square"></ion-icon>
				<ion-label>Tab 3</ion-label>
			</ion-tab-button>
		</ion-tab-bar>
	</ion-tabs>`
})
export default class TabsPage {
	
}