import { Component, Input } from "@angular/core";
import { Emotions } from "./mocks";
import { SettingProvider } from "../../providers/setting/setting";
import { ApiProvider } from "../../providers/api/api";

@Component({
  selector: "notification",
  templateUrl: "notification.html"
})
export class NotificationComponent {
  @Input() notification;
  Emotions: any = Emotions;
  constructor(private setting: SettingProvider, private api: ApiProvider) {}

  selectEmotion(emotion) {
    let params = {
      emotion: emotion.type,
      notificationId: this.notification._id
    };
    this.api.sendEmotion(params).subscribe(
      data => {
        this.Emotions = [];
        this.notification.respond = true;
      },
      err => {
        console.log("emotion error is : ", err);
      }
    );
  }

  getDifferenceDays(date) {
    let finalDate = this.setting.getDateDifferenceInDays(date);
    if (finalDate < 0) {
      return `
        <span> ${Math.abs(finalDate)} days </span>
      `;
    } else if (finalDate == 0) {
      return `
        <span> Today </span>
      `;
    }
  }
}
