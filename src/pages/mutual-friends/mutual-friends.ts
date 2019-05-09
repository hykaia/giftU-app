import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  ViewController
} from "ionic-angular";
import * as _ from "lodash";

@IonicPage()
@Component({
  selector: "page-mutual-friends",
  templateUrl: "mutual-friends.html"
})
export class MutualFriendsPage {
  Friends: any = this.navParams.get("friends");
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appCtrl: App,
    private viewCtrl: ViewController
  ) {
    this.Friends = _.filter(this.Friends, friend => {
      return _.has(friend, "name");
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openFriendProfile(friend) {
    this.dismiss();
    this.appCtrl
      .getRootNavs()[0]
      .push("UserProfilePage", { profile: friend }, { animate: false });
  }
}
