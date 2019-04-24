import { Component, Input } from "@angular/core";
import { codes } from "./mocks";
import {
  NavController,
  Events,
  LoadingController,
  AlertController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";

@Component({
  selector: "gifts-slider",
  templateUrl: "gifts-slider.html"
})
export class GiftsSliderComponent {
  @Input() occasion;
  codes: any = codes;
  defaultImg = "assets/imgs/iPhone-X.png";
  loading: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private setting: SettingProvider,
    private event: Events
  ) {}

  AddGift(id) {
    this.navCtrl.push("CreateGiftPage", { occasionId: id });
  }

  editGift(gift) {
    this.navCtrl.push("CreateGiftPage", { gift: gift });
  }

  deleteGift(gift) {
    this.presentLoadingDefault();
    this.api.deleteGift(gift.id).subscribe(
      data => {
        if (data.code == "201") {
          this.setting.presentToast(data.message);
          this.event.publish("giftDeleted");
        }
        this.loading.dismiss();
      },
      err => {
        this.loading.dismiss();
      }
    );
  }

  presentDeleteConfirm(gift) {
    let alert = this.alertCtrl.create({
      title: "Confirm remove",
      message: "Do you want to delete this item?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Delete",
          handler: () => {
            this.deleteGift(gift);
          }
        }
      ]
    });
    alert.present();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loading.present();
  }
}
