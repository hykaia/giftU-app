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
    let date = this.setting.getDateDifferenceInDays(occasion.date);
    if (date > 0) {
      return `
        <div class="remaining-days-wrapper" [class.adjust-middle]="0">
          <div class="remaining-days">${date}</div>
          <div class="days-txt"> days </div>
        </div>
      `;
    } else if (date == 0) {
      return `
        <div class="remaining-days-wrapper">
          <div class="days-txt now"> Now </div>
        </div>
      `;
    }
  }
}
