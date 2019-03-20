import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
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
    public navParams: NavParams
  ) {
    console.log("FriendsFriendsFriends : ", this.Friends);
  }

  ionViewDidLoad() {
    //  code here
  }

  Search() {
    this.filterFriends = this.Friends.filter(item => {
      if (item.name != null && item.phone != null) {
        return (
          item.name.toLowerCase().indexOf(this.data.search.toLowerCase()) >
            -1 ||
          item.phone.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1
        );
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openUserProfile(friend) {
    this.navCtrl.push(
      "UserProfilePage",
      { profile: friend },
      { animate: false }
    );
  }
}
