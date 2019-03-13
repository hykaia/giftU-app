import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { CameraPreview } from "@ionic-native/camera-preview";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";

@IonicPage()
@Component({
  selector: "page-create-gift",
  templateUrl: "create-gift.html"
})
export class CreateGiftPage {
  occasionData: any = this.navParams.get("data");
  gift: any = this.navParams.get("gift");
  isWaiting: boolean = false;
  data: any = {
    title: "iPhone xs max",
    description: "i want iPhone xs max - Black"
  };
  constructor(
    public navCtrl: NavController,
    private cameraPreview: CameraPreview,
    private api: ApiProvider,
    private setting: SettingProvider,
    private event: Events,
    public navParams: NavParams
  ) {
    console.log("a7a gift : ", this.gift);
    if (this.gift) {
      this.data = this.gift;
    }
  }

  ionViewWillEnter() {
    this.cameraPreview.stopCamera();
  }

  share() {
    this.isWaiting = true;
    this.data.occasion_id = this.occasionData.occasionId;
    this.data.image = this.occasionData.img;
    console.log("data before send : ", this.data);
    this.api.addGift(this.data).subscribe(
      data => {
        this.isWaiting = false;
        this.popToMyProfile();
      },
      err => {
        this.isWaiting = false;
        console.log("add gift error is : ", err);
      }
    );
  }

  edit() {
    this.api.editGift(this.data).subscribe(data => {
      console.log("response data : ", data);
      if (data.code == "201") {
        this.setting.presentToast(data.message);
        this.popToMyProfile();
      }
    });
  }

  popToMyProfile() {
    this.navCtrl.push("MyProfilePage").then(() => {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
  }
}
