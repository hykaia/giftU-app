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
    gift.hasGiven = true;
    this.api.giveGift(gift).subscribe(
      data => {
        this.setting.presentToast("You give gift successfully");
        let index = this.gifts.indexOf(gift);
        this.gifts.splice(index, 1);
        gift.hasGiven = false;
      },
      err => {
        gift.hasGiven = false;
        console.log("give gift error : ", err);
      }
    );
  }

  suggestGift(gift) {
    gift.userId = this.userData.id;
    let modal = this.modalCtrl.create("SuggestGiftPage", { giftData: gift });
    modal.onDidDismiss(data => {});
    modal.present();
  }
}
