import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { Keyboard } from "@ionic-native/keyboard";
@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  isWaiting: boolean = false;
  isKeyBoardShow: boolean = false;
  data: any = {
    countryCode: "+966"
  };
  countrCodes: any[] = [{ code: "+2" }, { code: "+966" }];
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    private general: GeneralProvider,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.checkKeyBoardEvents();
  }

  ionViewDidEnter() {}

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

  Login() {
    // this.data = {
    //   first_name: "mohammed",
    //   last_name: "mokhtar",
    //   status: "iam good",
    //   phone: "012324352532",
    //   gender: "male",
    //   date_of_birth: "1990-10-15",
    //   device_id: "54236643652",
    //   device_type: "iPhone 6",
    //   device_token: "a98ucsa8ayv76ta5rc5we6fg78f9he8w7gvr6fe5r6e7g87e"
    // };
    // this.api.register(this.data).subscribe(
    //   data => {
    //     console.log("registration data : ", data);
    //   },
    //   err => {
    //     console.log("error is : ", JSON.stringify(err));
    //   }
    // );

    this.navCtrl.push("VerificationPage", { loginData: this.data });
    // this.isWaiting = true
    // let params = {
    //   phone: `${this.data.countryCode}${this.data.phone}`
    // }
    // this.api.login(params).subscribe(
    //   data => {
    //     if (data.success) {
    //       this.navCtrl.push("VerficationPage", { loginData: this.data });
    //     }
    //     this.isWaiting = false
    //   },
    //   err => {
    //     this.general.showErrors(err);
    //     this.isWaiting = false
    //   }
    // )
  }
}
