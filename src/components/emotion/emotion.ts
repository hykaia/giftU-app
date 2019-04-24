import { Component, Input } from "@angular/core";

@Component({
  selector: "emotion",
  templateUrl: "emotion.html"
})
export class EmotionComponent {
  @Input() emotion;
  constructor() {}
}
