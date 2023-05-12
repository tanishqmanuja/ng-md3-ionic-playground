import { AsyncPipe, NgFor } from "@angular/common";
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IonMdHeadlineComponent } from "src/app/shared/ui/ion-md-header/ion-md-headline.component";
import { IonMdHeaderBehaviourDirective } from "src/app/shared/ui/ion-md-header/ion-md-header-behaviour.directive";
import { ThemeService } from "src/app/shared/data-access/theme.service";

import { MdSwitch } from "@material/web/switch/switch";

import "@material/web/switch/switch";
import "@material/web/list/list";
import "@material/web/list/list-item";
import "@material/web/icon/icon";

@Component({
  selector: "lab-page",
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    AsyncPipe,
    IonMdHeadlineComponent,
    IonMdHeaderBehaviourDirective,
  ],
  template: `
    <ion-header
      md-behaviour
      [contentRef]="content"
      [headlineRef]="headline"
      size="large"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/todos"></ion-back-button>
        </ion-buttons>
        <ion-title>Lab</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content #content>
      <ion-md-headline #headline>Lab</ion-md-headline>

      <md-list>
        <md-list-item
          headline="Use Dark Theme"
          supportingText="Will not change automatically."
        >
          <md-icon slot="start" data-variant="icon">{{
            darkSwitch.selected ? "dark_mode" : "light_mode"
          }}</md-icon>
          <md-switch #darkSwitch (change)="changeTheme($event)" slot="end" />
        </md-list-item>
      </md-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class LabPage implements AfterViewInit {
  @ViewChild("darkSwitch", { static: true, read: ElementRef })
  darkSwitchRef!: ElementRef<MdSwitch>;

  protected readonly themeService = inject(ThemeService);

  ngAfterViewInit(): void {
    this.darkSwitchRef.nativeElement.selected =
      this.themeService.getUserColorScheme() === "dark";
  }

  changeTheme(ev: Event) {
    const value = (ev.target as MdSwitch).selected;
    this.themeService.setUserColorScheme(value ? "dark" : "light");
  }
}
