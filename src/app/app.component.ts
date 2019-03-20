import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";

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
    this.setFakeUser();
    this.initialize();
    this.arrangeArray();
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

  setFakeUser() {
    let userData = {
      created_at: "2019-03-07 14:19:27",
      date_of_birth: "2000-01-01",
      first_name: "Hossam",
      gender: "male",
      id: 1,
      last_name: "Hassan",
      name: "Hossam hassan",
      phone: "01099499283",
      profile_image: null,
      status: "happy",
      updated_at: "2019-03-07 14:19:27"
    };
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  arrangeArray() {}
}
