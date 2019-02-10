import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  isLogin: boolean = JSON.parse(localStorage.getItem('isLogin'))
  isProfileComplete: boolean = JSON.parse(localStorage.getItem('isProfileComplete'))
  rootPage: string = 'LoginPage'
  // rootPage: string = 'InviteYourFriendsPage'

  constructor(
    private platform: Platform,
    private keyboard : Keyboard,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    // this.checkDefaultRoute()
    this.intialize()
    this.getLowestNumber()
  }

  intialize() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.backgroundColorByHexString("#142f4c");
        this.splashScreen.hide()
        this.keyboard.hideFormAccessoryBar(false)
      }
    })
  }

  checkDefaultRoute() {
    if (localStorage.hasOwnProperty("isLogin")) {
      if (!localStorage.hasOwnProperty("isProfileComplete") && !localStorage.hasOwnProperty("isUserExist")) {
        this.rootPage = 'RegisterPage'
      } else {
        this.rootPage = 'MyFriendsPage'
      }
    } else if (localStorage.hasOwnProperty("isLogin") && localStorage.hasOwnProperty("isProfileComplete")) {
      this.rootPage = 'InviteYourFriendsPage'
    } else {
      // this.rootPage = 'InviteYourFriendsPage' //for test only
      this.rootPage = 'LoginPage'
    }
  }


  getLowestNumber(){
      console.log("asd");
      let arr:any = [65,245,9,234,567,1,3]
      
  }
}
