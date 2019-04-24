import { Component, Input } from "@angular/core";
import { codes } from "../gifts-slider/mocks";
import {
  NavController,
  Events,
  LoadingController,
  AlertController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";

@Component({
  selector: "wishlist-gifts-slider",
  templateUrl: "wishlist-gifts-slider.html"
})
export class WishlistGiftsSliderComponent {
  @Input() wishlist;
  codes: any = codes;
  loading: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private event: Events,
    private setting: SettingProvider
  ) {}

  AddGiftToWishList() {
    this.navCtrl.push("CreateGiftPage", { occasionId: 0 });
  }

  editGift(gift) {
    this.navCtrl.push("CreateGiftPage", { gift: gift });
  }

  deleteGift(gift) {
    this.api.deleteGift(gift.id).subscribe(data => {
      if (data.code == "201") {
        this.setting.presentToast(data.message);
        this.event.publish("giftDeletedFromWishList");
      }
    });
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loading.present();
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
}
