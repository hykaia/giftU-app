import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import { SettingProvider } from "../../providers/setting/setting";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "occasion",
  templateUrl: "occasion.html"
})
export class OccasionComponent {
  @Input() occasion;
  @Input() days;
  @Input() now;
  msgTranslation: any;
  constructor(
    private setting: SettingProvider,
    private translate: TranslateService
  ) {}

  // ngOnInit() {
  //   this.translate.get(["days", "now"]).subscribe(data => {
  //     this.msgTranslation = data;
  //     console.log("occasion component data translate", data);
  //   });
  // }
  getDifferenceDays(occasion) {
    let date = this.setting.getDateDifferenceInDays(occasion.date);
    if (date > 0) {
      return `
        <div class="remaining-days-wrapper" [class.adjust-middle]="0">
          <div class="remaining-days">${date}</div>
          <div class="days-txt"> ${this.days} </div>
        </div>
      `;
    } else if (date == 0) {
      return `
        <div class="remaining-days-wrapper">
          <div class="days-txt now"> ${this.now} </div>
        </div>
      `;
    }
  }
}
