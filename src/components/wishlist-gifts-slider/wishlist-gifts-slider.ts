import { Component, Input } from "@angular/core";
import { codes } from "../gifts-slider/mocks";
import { NavController } from "ionic-angular";

@Component({
  selector: "wishlist-gifts-slider",
  templateUrl: "wishlist-gifts-slider.html"
})
export class WishlistGiftsSliderComponent {
  @Input() wishlist;
  codes: any = codes;
  constructor(private navCtrl: NavController) {}

  AddGiftToWishList() {
    this.navCtrl.push("UploadGiftImgPage", { occasionId: 0 });
  }

  editGift(gift) {
    this.navCtrl.push("UploadGiftImgPage", { gift: gift });
  }
}
