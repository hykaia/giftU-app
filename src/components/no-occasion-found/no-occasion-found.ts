import { Component, Input } from "@angular/core";

@Component({
  selector: "no-occasion-found",
  templateUrl: "no-occasion-found.html"
})
export class NoOccasionFoundComponent {
  @Input() data;
  constructor() {}
}
