import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";

@IonicPage()
@Component({
  selector: "page-suggest-gift",
  templateUrl: "suggest-gift.html"
})
export class SuggestGiftPage {
  giftData: any = this.navParams.get("giftData");
  data: any = {
    title: "iPhone Xs Max",
    description: "What do you think about this, my friend?",
    is_anonymous: 0
  };
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private api: ApiProvider,
    private setting: SettingProvider,
    public navParams: NavParams
  ) {
    console.log("giftData : ", this.giftData);
  }

  suggestGift() {
    this.data.occasion_id = this.giftData.occasion_id;
    this.data.userWhoReceiveGift = this.giftData.userId;
    this.data.suggesting_user_id = JSON.parse(
      localStorage.getItem("userData")
    ).id;
    this.data.is_anonymous = this.data.is_anonymous ? 1 : 0;
    console.log("suggestion data  :", this.data);
    this.api.suggestGift(this.data).subscribe(data => {
      console.log("Suggest gift response : ", data);
      if (data.code == "201") {
        this.setting.presentToast("You have suggested gift successfully !");
        this.viewCtrl.dismiss(data.data);
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
