import { Component, Input } from "@angular/core";
import { Codes } from "./mocks";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
import { ModalController } from "ionic-angular";

@Component({
  selector: "friend-gifts-slider",
  templateUrl: "friend-gifts-slider.html"
})
export class FriendGiftsSliderComponent {
  @Input() gifts;
  @Input() userData;
  Codes: any = Codes;
  img = "assets/imgs/iPhone-X.png";
  constructor(
    private api: ApiProvider,
    private setting: SettingProvider,
    private modalCtrl: ModalController
  ) {}

  giveGift(gift) {
    this.api.giveGift(gift.id).subscribe(data => {
      if (data.code == "201") {
        this.setting.presentToast(data.message);
        let index = this.gifts.indexOf(gift);
        this.gifts.splice(index, 1);
      }
    });
  }

  suggestGift(gift) {
    gift.userId = this.userData.id;
    let modal = this.modalCtrl.create("SuggestGiftPage", { giftData: gift });
    modal.onDidDismiss(data => {});
    modal.present();
  }
}
