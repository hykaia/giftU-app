import { Component, Input } from "@angular/core";
import * as moment from "moment";
import { SettingProvider } from "../../providers/setting/setting";
@Component({
  selector: "occasion",
  templateUrl: "occasion.html"
})
export class OccasionComponent {
  @Input() occasion;
  constructor(private setting: SettingProvider) {}

  getDifferenceDays(occasion) {
    let date = this.setting.getDateDifferenceInDays(occasion.occasion_date);
    var todayDate = moment(new Date()).format("YYYY-MM-DD");
    if (occasion.occasion_date > todayDate) {
      return `
        <div class="remaining-days-wrapper" [class.adjust-middle]="0">
          <div class="remaining-days">${date}</div>
          <div class="days-txt"> days </div>
        </div>
      `;
    }
    if (occasion.occasion_date == todayDate) {
      return `
        <div class="remaining-days-wrapper">
          <div class="days-txt now"> Now </div>
        </div>
      `;
    }
  }
}
