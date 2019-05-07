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
import * as _ from "lodash";
@IonicPage()
@Component({
  selector: "page-user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfilePage {
  @ViewChild(Navbar) navBar: Navbar;
  userData: any = this.navParams.get("profile");
  waitingOccasions: boolean = true;
  occasions: any[] = [];
  reminderFriends: any;
  mutualFriends: any;
  mutualFriendsWhoWillShow: any;
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
    console.log("userData userData :", this.userData);

    this.getMutualFriends();
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

  getMutualFriends() {
    this.api.getMutualFriends(this.userData._id).subscribe(data => {
      console.log("mutual friends :", data);
      this.mutualFriends = data;
      let names: any[] = [];
      let firstHalf;
      for (let i = 0; i < data.length; i++) {
        if (_.has(data[i], "name")) {
          names.push(data[i].name);
        }
      }
      firstHalf = names.slice(0, 2);
      this.reminderFriends = names.length > 1 ? names.length - 2 : 0;
      this.mutualFriendsWhoWillShow = firstHalf.join(", ");
    });
  }

  inviteFriends() {
    let modal = this.modalCtrl.create("InviteYourFriendsPage", {
      isModal: true
    });
    modal.present();
  }

  getUserOccasions() {
    this.api.getUserOccasions(this.userData._id).subscribe(data => {
      console.log("user occasions is : ", data);
      this.occasions = data;
      this.waitingOccasions = false;
    });
  }

  openMutualFriends() {
    let modal = this.modalCtrl.create("MutualFriendsPage", {
      friends: this.mutualFriends
    });
    modal.present();
  }
}
