import { Component, ViewChild } from "@angular/core";
import { Platform, Events, Nav, ModalController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { OneSignal } from "@ionic-native/onesignal";
import { Sim } from "@ionic-native/sim";
import { ApiProvider } from "../providers/api/api";
import { TranslateService } from "@ngx-translate/core";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  // rootPage: string = "InviteYourFriendsPage";
  rootPage: string = "LoginPage";
  @ViewChild(Nav) nav: Nav;
  constructor(
    private platform: Platform,
    private keyboard: Keyboard,
    private oneSignal: OneSignal,
    private simCard: Sim,
    private modalCtrl: ModalController,
    private api: ApiProvider,
    private event: Events,
    private translate: TranslateService,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    this.checkDefaultRoute();
    // this.setFakeUser();
    this.checkLanguage();
    this.initialize();
    this.checkEvents();
  }

  checkEvents() {
    this.event.subscribe("logout", () => {
      this.rootPage = "LoginPage";
    });
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

  checkLanguage() {
    let lang = localStorage.getItem("lang");
    console.log("my lang is : ", lang);
    if (lang == "ar") {
      localStorage.setItem("lang", "ar");
      this.translate.use("ar");
      this.platform.setDir("rtl", true);
      this.platform.setLang("ar", true);
    } else if (lang == "en" || !lang) {
      localStorage.setItem("lang", "en");
      this.translate.use("en");
      this.platform.setDir("ltr", true);
      this.platform.setLang("en", true);
    }
  }

  checkDefaultRoute() {
    let isLogin = JSON.parse(localStorage.getItem("isLogin"));
    if (isLogin != null && isLogin) {
      this.rootPage = "TabsPage";
      this.updateDeviceToken();
    } else {
      this.rootPage = "LoginPage";
    }
  }

  updateDeviceToken() {
    let device_token = localStorage.getItem("device_token");
    let params = {
      one_signal_token: device_token ? device_token : ""
    };
    console.log("my updated device token is :", device_token);
    this.api.register(params).subscribe(
      data => {
        console.log("device token updated");
      },
      err => {
        console.log("register error is :", JSON.stringify(err));
      }
    );
  }

  checkPushNotification() {
    let notificationOpenedCallback = function(jsonData) {
      console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
    };
    this.oneSignal.startInit(
      "977f3f4e-4e84-4f23-bf12-c06fd9cf432c",
      "131172456512"
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );
    this.oneSignal.setSubscription(true);
    // When a push notification is received handle
    // how the application will respond
    this.oneSignal.handleNotificationReceived().subscribe(msg => {
      this.event.publish("notificationRecived");
      console.log("notification msg : ", JSON.stringify(msg));
    });

    this.oneSignal.handleNotificationOpened().subscribe(msg => {
      let modal = this.modalCtrl.create("NotificationsPage");
      modal.present();
    });

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
