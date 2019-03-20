import { Component, OnInit } from "@angular/core";
import { occasionTypes } from "../../pages/my-profile/mocks";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
import { Events } from "ionic-angular";
import * as _ from "lodash";
@Component({
  selector: "create-occasion",
  templateUrl: "create-occasion.html"
})
export class CreateOccasionComponent implements OnInit {
  occasionTypes = occasionTypes;
  data: any = {
    privacy_type: "public"
  };
  isWaiting: boolean = false;
  constructor(
    private api: ApiProvider,
    private setting: SettingProvider,
    private event: Events
  ) {}

  ngOnInit() {
    // code here
  }

  addOccasion() {
    console.log("add occasion data : ", this.data);
    if (!_.has(this.data, "type")) {
      this.setting.presentToast("Add Occasion Type First !");
    } else if (!_.has(this.data, "occasion_date")) {
      this.setting.presentToast("Add Occasion Date First !");
    } else {
      this.isWaiting = true;
      this.api.addOccasion(this.data).subscribe(
        data => {
          if (data.code == "201") {
            this.setting.presentToast(data.message);
            this.event.publish("occasionAdded");
          }
          this.isWaiting = false;
        },
        err => {
          this.isWaiting = false;
        }
      );
    }
  }

  selectOccasionType(occasion) {
    this.occasionTypes.forEach((item: any) => {
      if (item.active) {
        item.active = false;
      }
    });
    if (occasion.active) {
      occasion.active = false;
    } else {
      occasion.active = true;
      this.data.type = occasion.value;
    }
  }
}
