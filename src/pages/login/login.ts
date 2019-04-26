import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { Keyboard } from "@ionic-native/keyboard";
import { FormBuilder, Validators } from "@angular/forms";
import { Countries } from "../../countries_codes";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  isWaiting: boolean = false;
  loginForm: any;
  Countries: any[] = Countries;
  isKeyBoardShow: boolean = false;
  data: any = {
    countryCode: localStorage.getItem("countryCode")
      ? localStorage.getItem("countryCode")
      : "+20"
  };

  countrCodes: any[] = [{ code: "+20" }, { code: "+966" }];
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    public builder: FormBuilder,
    private general: GeneralProvider,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.loginForm = this.builder.group({
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern("^[0-9]*$")
        ])
      ]
    });
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

  Login() {
    let params = {
      mobile: `${this.data.countryCode}${this.data.phone.replace(/^0+/, "")}`
    };
    if (!this.data.phone) {
      this.general.showCustomAlert("Warning", "You must enter phone number");
    } else {
      this.isWaiting = true;
      this.data.phone = this.general.convertNumber(this.data.phone);
      this.api.login(params).subscribe(
        data => {
          console.log("login  response is : ", data);
          // alert(data.mobile_token);
          let loginParams = {
            userId: data.id,
            phone: this.data.phone
          };
          this.navCtrl.push("VerificationPage", { loginData: loginParams });
          this.isWaiting = false;
        },
        err => {
          this.general.showError(err.error);
          console.log("error is : ", JSON.stringify(err));
          this.isWaiting = false;
        }
      );
    }
  }
}
