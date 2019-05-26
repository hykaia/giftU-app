import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  AlertController
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ApiProvider } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  lang = localStorage.getItem("lang");
  data: any = {};
  msgTranslated;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private splashScreen: SplashScreen,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private api: ApiProvider,
    private platform: Platform
  ) {
    this.data.language = this.lang ? this.lang : "en";
  }

  ionViewDidEnter() {
    this.translate
      .get(["application_restart", "ok", "cancel"])
      .subscribe(data => {
        this.msgTranslated = data;
      });
  }

  changeLang() {
    let prompt = this.alertCtrl.create({
      message: this.msgTranslated.application_restart,
      buttons: [
        {
          text: this.msgTranslated.cancel,
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: this.msgTranslated.ok,
          handler: data => {
            console.log(this.data.language);
            if (this.data.language == "ar") {
              this.updateProfile("ar");
            } else if (this.data.language == "en") {
              this.updateProfile("en");
            }
          }
        }
      ]
    });
    prompt.present();
  }

  updateProfile(userLang) {
    this.api.updateProfile(this.data).subscribe(
      data => {
        this.navCtrl.setRoot("TabsPage");
        this.trans(userLang);
      },
      err => {
        console.log("update profile error : ", err);
      }
    );
  }

  trans(userLang) {
    if (userLang == "ar") {
      this.translate.use("ar");
      this.platform.setDir("rtl", true);
      this.platform.setLang("ar", true);
      localStorage.setItem("lang", "ar");
      this.translate.use("ar");
      this.translate.reloadLang("ar");
      this.splashScreen.show();
      this.navCtrl.setRoot("TabsPage").then(() => {
        window.location.reload();
      });
    } else {
      this.translate.use("en-US");
      localStorage.setItem("lang", "en");
      this.platform.setDir("ltr", true);
      this.platform.setLang("en-US", true);
      this.translate.use("en-US");
      this.translate.reloadLang("en-US");
      this.splashScreen.show();
      this.navCtrl.setRoot("TabsPage").then(() => {
        window.location.reload();
      });
    }
  }
}
