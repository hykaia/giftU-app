import { Component, Input } from "@angular/core";
import { Emotions } from "./mocks";

@Component({
  selector: "notification",
  templateUrl: "notification.html"
})
export class NotificationComponent {
  @Input() friend;
  Emotions: any = Emotions;
  constructor() {}
}
