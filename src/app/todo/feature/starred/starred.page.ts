import { Component } from "@angular/core";
import { PageLayoutComponent } from "../../../shared/ui/page-layout/page-layout";

@Component({
  selector: "starred-page",
  standalone: true,
  template: `<page-layout title="Starred"></page-layout> `,
  imports: [PageLayoutComponent],
})
export default class StarredPage {}
