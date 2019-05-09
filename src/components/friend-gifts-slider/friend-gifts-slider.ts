import { Component, Input, OnInit } from "@angular/core";
import { Codes } from "./mocks";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
import { ModalController, AlertController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "friend-gifts-slider",
  templateUrl: "friend-gifts-slider.html"
})
export class FriendGiftsSliderComponent implements OnInit {
  @Input() gifts;
  @Input() userData;
  Codes: any = Codes;
  msgTranslation;
  img = "assets/imgs/iPhone-X.png";
  constructor(
    private api: ApiProvider,
    private setting: SettingProvider,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.translate.get(["ok", "u_give_gift_success"]).subscribe(data => {
      this.msgTranslation = data;
      console.log("msgTranslation :", this.msgTranslation);
    });
  }

  giveGift(gift) {
    gift.hasGiven = true;
    this.api.giveGift(gift).subscribe(
      data => {
        this.setting.presentToast(this.msgTranslation.u_give_gift_success);
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

  showMore(text) {
    this.alertCtrl
      .create({
        subTitle: text,
        buttons: [this.msgTranslation.ok]
      })
      .present();
  }

  openImg(img) {
    let modal = this.modalCtrl.create("ImgModalPage", { img: img });
    modal.present();
  }
}
