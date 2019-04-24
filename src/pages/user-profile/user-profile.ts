import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Navbar
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";

@IonicPage()
@Component({
  selector: "page-user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfilePage {
  @ViewChild(Navbar) navBar: Navbar;
  userData: any = this.navParams.get("profile");
  waitingOccasions: boolean = true;
  wishListGifts: any[] = [];
  occasions: any[] = [];
  codes: any = {
    birthday: String.fromCodePoint(0x1f60e),
    love: String.fromCodePoint(0x1f618)
  };
  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private api: ApiProvider,
    private setting: SettingProvider,
    public navParams: NavParams
  ) {
    console.log("user data is : ", this.userData);
    this.getGeneralWishlist();
  }
  ionViewDidEnter() {
    this.setBackButtonAction();
    this.getUserOccasions();
  }

  //Method to override the default back button action
  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      this.navCtrl.pop({ animate: false });
    };
  }

  getUserOccasions() {
    this.api.getUserOccasions(this.userData.id).subscribe(data => {
      console.log("user occasions is : ", data);
      this.occasions = data.data;
      this.waitingOccasions = false;
    });
  }

  getGeneralWishlist() {
    this.api.generalWishlist(0, this.userData.id).subscribe(data => {
      console.log("general wishlist data are : ", data);
      if (data.code == "201") {
        this.wishListGifts = data.data;
      }
    });
  }
}
