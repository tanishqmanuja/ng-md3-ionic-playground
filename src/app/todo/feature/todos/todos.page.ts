import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { NgFor } from "@angular/common";
import { IonMdHeaderBehaviourDirective } from "src/app/shared/ui/ion-md-header/ion-md-header-behaviour.directive";

@Component({
  selector: "todos-page",
  standalone: true,
  imports: [IonicModule, NgFor, IonMdHeaderBehaviourDirective],
  template: `
    <ion-header md-behaviour [contentRef]="content">
      <ion-toolbar>
        <ion-title>Todos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content #content>
      <ng-container *ngFor="let i of [1, 2, 3, 4, 5, 6, 7]">
        <ion-list>
          <ion-list-header>
            <ion-skeleton-text
              [animated]="true"
              style="width: 80px"
            ></ion-skeleton-text>
          </ion-list-header>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 30%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ng-container>
    </ion-content>
  `,
  styles: [
    `
      ion-list {
        --ion-item-background: var(--md-sys-color-background, #000);
      }

      ion-skeleton-text {
        --border-radius: 6px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TodosPage {}
