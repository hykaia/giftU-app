import { Component, Input } from "@angular/core";
import { codes } from "./mocks";
import { NavController } from "ionic-angular";

@Component({
  selector: "gifts-slider",
  templateUrl: "gifts-slider.html"
})
export class GiftsSliderComponent {
  @Input() occasion;
  codes: any = codes;
  constructor(private navCtrl: NavController) {}

  AddGift(id) {
    this.navCtrl.push("UploadGiftImgPage", { occasionId: id });
  }

  editGift(gift) {
    this.navCtrl.push("UploadGiftImgPage", { gift: gift });
  }
}
