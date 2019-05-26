import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { Keyboard } from "@ionic-native/keyboard";
import { FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Sim } from "@ionic-native/sim";
import { countries } from "./mocks";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  isWaiting: boolean = false;
  loginForm: any;
  msgTranslation;
  isLoading: boolean = true;
  showBackgroundLogo: boolean = false;
  countries: any[] = countries;
  isKeyBoardShow: boolean = false;
  data: any = {
    countryCode: "+20"
  };
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    public builder: FormBuilder,
    private translate: TranslateService,
    private simCard: Sim,
    private general: GeneralProvider,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.checkBackgroundLogo();
    this.getCountryCode();
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

  ionViewDidLoad() {
    this.translate
      .get(["warning", "u_must_enter_phone_number"])
      .subscribe(data => {
        this.msgTranslation = data;
      });
  }
  checkBackgroundLogo() {
    if (this.platform.is("android")) {
      this.showBackgroundLogo = false;
    } else {
      this.showBackgroundLogo = true;
    }
  }

  getCountryCode() {
    this.simCard.requestReadPermission().then(
      () => {
        this.simCard.getSimInfo().then(
          data => {
            let countryCodeObj: any;
            let countryCode: any = data.countryCode;
            countryCode = countryCode.toUpperCase();
            this.isLoading = false;
            countryCodeObj = this.countries.filter(item => {
              return item.code == countryCode;
            });
            this.data.countryCode = countryCodeObj[0].dial_code.toString();
          },
          err => {
            console.log("sim err is :", err);
          }
        );
      },
      () => {
        this.general.showCustomAlert(
          "Alert",
          "You must have sim card in your device to select your country code"
        );
        console.log("Permission denied");
      }
    );
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
      this.general.showCustomAlert(
        this.msgTranslation.warning,
        this.msgTranslation.u_must_enter_phone_number
      );
    } else {
      this.isWaiting = true;
      this.data.phone = this.general.convertNumber(this.data.phone);
      this.api.login(params).subscribe(
        data => {
          alert(data.mobile_token);
          let loginParams = {
            userId: data.id,
            phone: this.data.phone
          };

          localStorage.setItem("userId", data.id);
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
