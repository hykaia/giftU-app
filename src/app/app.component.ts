import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { formatUrlPart } from "ionic-angular/umd/navigation/url-serializer";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  isLogin: boolean = JSON.parse(localStorage.getItem("isLogin"));
  isProfileComplete: boolean = JSON.parse(
    localStorage.getItem("isProfileComplete")
  );
  rootPage: string = "MyFriendsPage";
  // rootPage: string = "InviteYourFriendsPage";

  constructor(
    private platform: Platform,
    private keyboard: Keyboard,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    // this.checkDefaultRoute();
    // if (this.platform.is("cordova")) {
    let userData = {
      id: 34,
      name: "Mohammed Mokhtar",
      status: "Happy!!",
      created_at: "2019-03-13 12:12:32",
      updated_at: "2019-03-13 12:12:32",
      first_name: "Mohammed",
      last_name: "Mokhtar",
      phone: "01028734848",
      profile_image: null,
      gender: "male",
      date_of_birth: "1993-8-14"
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    // }

    this.initialize();
  }

  initialize() {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.statusBar.backgroundColorByHexString("#142f4c");
        this.splashScreen.hide();
        this.keyboard.hideFormAccessoryBar(false);
      }
    });
  }

  checkDefaultRoute() {
    if (localStorage.hasOwnProperty("isLogin")) {
      if (
        !localStorage.hasOwnProperty("isProfileComplete") &&
        !localStorage.hasOwnProperty("isUserExist")
      ) {
        this.rootPage = "RegisterPage";
      } else {
        this.rootPage = "MyFriendsPage";
      }
    } else if (
      localStorage.hasOwnProperty("isLogin") &&
      localStorage.hasOwnProperty("isProfileComplete")
    ) {
      this.rootPage = "InviteYourFriendsPage";
    } else {
      // this.rootPage = 'InviteYourFriendsPage' //for test only
      this.rootPage = "LoginPage";
    }
  }
}
