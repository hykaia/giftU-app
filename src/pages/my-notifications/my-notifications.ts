import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-my-notifications",
  templateUrl: "my-notifications.html"
})
export class MyNotificationsPage {
  userData: any = JSON.parse(localStorage.getItem("userData"));
  currentPage: number = 0;
  limitResults: number = 10;
  pagesCount: any;
  isLoading: boolean = true;
  Notifications: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    private event: Events,
    private api: ApiProvider
  ) {
    this.getUserNotifications();
    this.checkEvents();
  }

  checkEvents() {
    this.event.subscribe("notificationRecived", () => {
      this.ngZone.run(() => {
        this.getUserNotifications();
      });
    });
  }
  getUserNotifications() {
    this.api
      .getUserNotifications(this.currentPage, this.limitResults)
      .subscribe(
        data => {
          this.pagesCount = Math.ceil(data.length / this.limitResults);
          this.Notifications = data.notifications;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          console.log("notifications err :", err);
        }
      );
  }

  doInfinite(scroll) {
    this.currentPage += 1;
    if (this.currentPage <= this.pagesCount) {
      this.api
        .getUserNotifications(this.currentPage, this.limitResults)
        .subscribe(data => {
          this.Notifications = this.Notifications.concat(data.notifications);
          scroll.complete();
        });
    } else {
      scroll.complete();
    }
  }
  openSetting() {
    this.navCtrl.push("SettingsPage");
  }
  openMyProfile() {
    this.navCtrl.push("MyProfilePage", {}, { animate: false });
  }
}
