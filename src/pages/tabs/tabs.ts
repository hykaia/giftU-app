import { Component } from "@angular/core";
import { NavController, NavParams, IonicPage } from "ionic-angular";
@IonicPage()
@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = "MyFriendsPage";
  tab2Root = "OccasionsPage";
  tab3Root = "MyNotificationsPage";
  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
