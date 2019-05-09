import { Component, Input, OnInit } from "@angular/core";
import { Emotions } from "./mocks";
import { SettingProvider } from "../../providers/setting/setting";
import { ApiProvider } from "../../providers/api/api";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "notification",
  templateUrl: "notification.html"
})
export class NotificationComponent implements OnInit {
  @Input() notification;
  Emotions: any = Emotions;
  msgTranslation;
  constructor(
    private setting: SettingProvider,
    private api: ApiProvider,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.translate.get(["days", "today"]).subscribe(data => {
      this.msgTranslation = data;
    });
  }
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
        <span> ${Math.abs(finalDate)} ${this.msgTranslation.days} </span>
      `;
    } else if (finalDate == 0) {
      return `
        <span> ${this.msgTranslation.today} </span>
      `;
    }
  }
}
