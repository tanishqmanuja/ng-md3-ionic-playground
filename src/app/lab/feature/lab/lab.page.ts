import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
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
import { PushPipe } from "@rx-angular/template/push";
import { ColorScheme } from "src/app/shared/utils/ng/user-color-scheme";

@Component({
  selector: "lab-page",
  standalone: true,
  imports: [
    IonicModule,
    PushPipe,
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
          [supportingText]="themeSupportingText"
        >
          <md-icon slot="start" filled data-variant="icon">{{
            themeIcon
          }}</md-icon>
          <md-switch
            slot="end"
            [selected]="themeService.isDarkMode$ | push : 'local'"
            (change)="changeTheme($event)"
          />
        </md-list-item>
      </md-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class LabPage {
  protected readonly themeService = inject(ThemeService);

  get themeIcon(): string {
    switch (this.themeService.getUserColorScheme()) {
      case ColorScheme.AUTO: {
        return "brightness_medium";
      }
      case ColorScheme.DARK: {
        return "dark_mode";
      }
      case ColorScheme.LIGHT: {
        return "light_mode";
      }
    }
  }

  get themeSupportingText(): string {
    return this.themeService.getUserColorScheme() === ColorScheme.AUTO
      ? "Will change automatically."
      : "Will not change automatically.";
  }

  changeTheme(ev: Event) {
    const value = (ev.target as MdSwitch).selected;
    this.themeService.setUserColorScheme(
      value ? ColorScheme.DARK : ColorScheme.LIGHT
    );
  }
}
