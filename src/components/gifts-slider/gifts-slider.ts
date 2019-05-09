import { Component, Input, OnInit } from "@angular/core";
import { codes } from "./mocks";
import {
  NavController,
  Events,
  LoadingController,
  AlertController,
  ModalController
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";

@Component({
  selector: "gifts-slider",
  templateUrl: "gifts-slider.html"
})
export class GiftsSliderComponent implements OnInit {
  @Input() occasion;
  codes: any = codes;
  msgTranslation: any;
  defaultImg = "assets/imgs/iPhone-X.png";
  loading: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiProvider,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private setting: SettingProvider,
    private event: Events
  ) {}

  ngOnInit() {
    this.translate
      .get([
        "confirm_delete",
        "do_u_want_delete_this_gift",
        "cancel",
        "delete",
        "ok",
        "please_wait"
      ])
      .subscribe(data => {
        this.msgTranslation = data;
        console.log("msgTranslation :", this.msgTranslation);
      });
  }

  AddGift(id) {
    this.navCtrl.push("CreateGiftPage", { occasionId: id });
  }

  editGift(gift) {
    this.navCtrl.push("CreateGiftPage", { gift: gift });
  }

  deleteGift(gift) {
    this.presentLoadingDefault();
    let params = {
      occasionId: gift.occasion,
      giftId: gift._id
    };
    this.api.deleteGift(params).subscribe(
      data => {
        this.setting.presentToast(data.message);
        this.event.publish("giftDeleted");
        this.loading.dismiss();
      },
      err => {
        this.loading.dismiss();
      }
    );
  }

  presentDeleteConfirm(gift) {
    let alert = this.alertCtrl.create({
      title: this.msgTranslation.confirm_delete,
      message: this.msgTranslation.do_u_want_delete_this_gift,
      buttons: [
        {
          text: this.msgTranslation.cancel,
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: this.msgTranslation.delete,
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
      content: this.msgTranslation.please_wait
    });
    this.loading.present();
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
