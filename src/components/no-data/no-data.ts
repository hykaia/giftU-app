import { Component, Input } from "@angular/core";

@Component({
  selector: "no-data",
  templateUrl: "no-data.html"
})
export class NoDataComponent {
  @Input() data;
  constructor() {}
}
