import { NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { PageLayoutComponent } from "../../../shared/ui/page-layout/page-layout";

@Component({
  selector: "lab-page",
  standalone: true,
  template: ` <page-layout title="Lab"></page-layout> `,
  imports: [IonicModule, NgFor, PageLayoutComponent],
})
export default class LabPage {}
