import { Component } from "@angular/core";
import { PageLayoutComponent } from "../../../shared/ui/page-layout/page-layout.component";

@Component({
  selector: "starred-page",
  standalone: true,
  template: `<page-layout title="Starred"></page-layout> `,
  imports: [PageLayoutComponent],
})
export default class StarredPage {}
