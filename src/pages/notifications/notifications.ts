import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Events
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-notifications",
  templateUrl: "notifications.html"
})
export class NotificationsPage {
  Notifications: any;
  isLoading: boolean = true;
  notificationsPagesCount: any;
  currentPageNotification: number = 0;
  limitNotificationResults: number = 10;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private event: Events,
    private api: ApiProvider,
    private viewCtrl: ViewController
  ) {
    this.getUserNotifications();
    this.checkEvents();
  }

  checkEvents() {
    this.event.subscribe("notificationRecived", () => {
      this.getUserNotifications();
    });
  }

  getUserNotifications() {
    this.api
      .getUserNotifications(
        this.currentPageNotification,
        this.limitNotificationResults
      )
      .subscribe(
        data => {
          console.log("user notifications are :", data);
          this.notificationsPagesCount = Math.ceil(
            data.length / this.limitNotificationResults
          );
          this.Notifications = data.notifications;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doInfiniteNotifications(scroll) {
    this.currentPageNotification += 1;
    if (this.currentPageNotification <= this.notificationsPagesCount) {
      this.api
        .getUserNotifications(
          this.currentPageNotification,
          this.limitNotificationResults
        )
        .subscribe(data => {
          this.Notifications = this.Notifications.concat(data.notifications);
          scroll.complete();
        });
    } else {
      scroll.complete();
    }
  }
}
