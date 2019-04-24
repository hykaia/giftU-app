import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { OneSignal } from "@ionic-native/onesignal";
import { Sim } from "@ionic-native/sim";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  // rootPage: string = "InviteYourFriendsPage";
  rootPage: string = "LoginPage";

  constructor(
    private platform: Platform,
    private keyboard: Keyboard,
    private oneSignal: OneSignal,
    private simCard: Sim,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    this.checkDefaultRoute();
    // this.setFakeUser();
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.statusBar.backgroundColorByHexString("#142f4c");
        this.splashScreen.hide();
        this.getSimCardInfo();
        this.checkPushNotification();
        this.keyboard.hideFormAccessoryBar(false);
      }
    });
  }

  checkDefaultRoute() {
    let isLogin = JSON.parse(localStorage.getItem("isLogin"));
    let isProfileComplete = JSON.parse(
      localStorage.getItem("isProfileComplete")
    );

    if (isLogin) {
      this.rootPage = "MyFriendsPage";
    } else {
      this.rootPage = "LoginPage";
    }
  }

  checkPushNotification() {
    let notificationOpenedCallback = function(jsonData) {
      console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
    };
    this.oneSignal.startInit(
      "977f3f4e-4e84-4f23-bf12-c06fd9cf432c",
      "377815980548"
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );
    this.oneSignal.setSubscription(true);
    // When a push notification is received handle
    // how the application will respond
    this.oneSignal.handleNotificationReceived().subscribe(msg => {
      console.log("notification msg : ", JSON.stringify(msg));
    });

    this.oneSignal.handleNotificationOpened().subscribe(msg => {});

    //  this.oneSignal.handleNotificationOpened(notificationOpenedCallback)
    this.oneSignal.endInit();
    this.oneSignal
      .getIds()
      .then(ids => {
        localStorage.setItem("device_token", ids.userId);
        let params = {
          device_token: ids.userId
        };
      })
      .catch(e => console.log(e));
  }

  setFakeUser() {
    let userData = {
      created_at: "2019-03-26 12:05:17",
      date_of_birth: "1993-08-14",
      first_name: "Mohammed",
      gender: "male",
      id: 1,
      last_name: "Mokhtar",
      name: "Mo Mokhtar",
      phone: "01028734848",
      profile_image: null,
      status: "Goooooooooooood!!",
      updated_at: "2019-03-26 12:05:17"
    };

    localStorage.setItem("userData", JSON.stringify(userData));
  }

  getSimCardInfo() {
    this.simCard.getSimInfo().then(data => {
      localStorage.setItem("countryCode", data.countryCode);
    });
  }
}
