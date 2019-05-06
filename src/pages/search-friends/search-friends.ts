import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  App
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-search-friends",
  templateUrl: "search-friends.html"
})
export class SearchFriendsPage {
  data: any = {};
  Friends: any = this.navParams.get("Friends");
  filterFriends: any[] = this.Friends;
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private app: App,
    public navParams: NavParams
  ) {
    console.log("FriendsFriendsFriends : ", this.Friends);
  }

  Search() {
    this.filterFriends = this.Friends.filter(item => {
      if (item.name != null && item.mobile != null) {
        return (
          item.name.toLowerCase().indexOf(this.data.search.toLowerCase()) >
            -1 ||
          item.mobile.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1
        );
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openUserProfile(friend) {
    /** we use app because of Navigating from an Overlay Component   */
    this.dismiss();
    this.app
      .getRootNavs()[0]
      .push("UserProfilePage", { profile: friend }, { animate: false });
  }
}
