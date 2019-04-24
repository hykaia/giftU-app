import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { Keyboard } from "@ionic-native/keyboard";
import { Sim } from "@ionic-native/sim";
import { Countries } from "../../countries_codes";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  isWaiting: boolean = false;
  Countries: any[] = Countries;
  isKeyBoardShow: boolean = false;
  data: any = {
    countryCode: "966"
  };
  countryCode = localStorage.getItem("countryCode")
    ? localStorage.getItem("countryCode")
    : "eg";
  countrCodes: any[] = [{ code: "20" }, { code: "966" }];
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    private general: GeneralProvider,
    private simCard: Sim,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.getSimCardInfo();
    this.checkKeyBoardEvents();
  }

  checkKeyBoardEvents() {
    this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.isKeyBoardShow = true;
    });

    this.keyboard.onKeyboardWillHide().subscribe(() => {
      setTimeout(() => {
        this.isKeyBoardShow = false;
      }, 50);
    });
  }

  getSimCardInfo() {
    let countryCodeObj: any;
    this.countryCode = this.countryCode.toUpperCase();
    countryCodeObj = this.Countries.filter(item => {
      return item.code == this.countryCode;
    });
    this.data.countryCode = countryCodeObj[0].dial_code
      .toString()
      .replace(/\+/g, "");
  }

  Login() {
    console.log("data : ", this.data);
    if (!this.data.phone) {
      this.general.showCustomAlert("Warning", "You must enter phone number");
    } else {
      this.isWaiting = true;
      this.data.phone = this.general.convertNumber(this.data.phone);
      this.api.login(this.data).subscribe(
        data => {
          if (data.code == "201") {
            this.data.loginData = data;
            this.navCtrl.push("VerificationPage", { loginData: this.data });
          }
          this.isWaiting = false;
          console.log("login data : ", JSON.stringify(data));
        },
        err => {
          console.log("error is : ", JSON.stringify(err));
          this.isWaiting = false;
        }
      );
    }
  }
}
