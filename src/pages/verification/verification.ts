import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { TimerObservable } from "rxjs/observable/TimerObservable";

@IonicPage()
@Component({
  selector: "page-verification",
  templateUrl: "verification.html"
})
export class VerificationPage implements OnInit {
  isWaiting: boolean = false;
  // @ViewChild("passwordInput") passwordInput;
  isDisabled: boolean = false;
  time: number = 15;
  subscription: any;
  loginData: any = this.navParams.get("loginData");
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private event: Events,
    private zone: NgZone,
    private general: GeneralProvider,
    public navParams: NavParams
  ) {
    console.log("loginData : ", this.loginData);
  }

  ngOnInit() {
    this.timeCount();
  }

  // ngAfterViewChecked() {
  //   setTimeout(() => {
  //     this.passwordInput.nativeElement.focus();
  //   }, 1000);
  // }

  verify() {
    let verificationData = {
      phone: this.loginData.phone,
      countryCode: this.loginData.countryCode
    };
    console.log("a7a verificationData : ", verificationData);

    this.navCtrl.setRoot("RegisterPage", {
      verificationData: verificationData
    }); // for test purpose
    // this.isWaiting = true;
    // let params = {
    //   phone: `${this.loginData.countryCode}${this.loginData.phone}`,
    //   password: this.loginData.password
    // };
    // this.api.verify(params).subscribe(
    //   data => {
    //     console.log("verify result :", data);
    //     if (data.success) {
    //       this.general.presentToast(data.message);
    //       localStorage.setItem("isLogin", JSON.stringify(true));
    //       localStorage.setItem("access_token", data.access_token);
    //       this.event.publish("loginSuccess");
    //       if (data.exist_user) {
    //         localStorage.setItem("isUserExist", JSON.stringify(true));
    //         this.navCtrl.setRoot("MyFriendsPage");
    //       } else {
    //         this.navCtrl.setRoot("RegisterPage");
    //       }
    //     }
    //     this.isWaiting = false;
    //   },
    //   err => {
    //     this.general.showErrors(err);
    //     this.isWaiting = false;
    //   }
    // );
  }

  timeCount() {
    this.time = 15;
    this.isDisabled = true;
    let timer = TimerObservable.create(1000, 1000);
    this.subscription = timer.subscribe(t => {
      this.zone.run(() => {
        this.time -= 1;
        if (this.time == 0) {
          this.isDisabled = false;
          this.subscription.unsubscribe();
        }
      });
    });
  }

  resend() {
    this.timeCount();
    let params = {
      phone: `${this.loginData.countryCode}${this.loginData.phone}`
    };
    this.api.login(params).subscribe(
      data => {
        this.general.presentToast(data.message);
      },
      err => {
        this.general.showErrors(err);
        this.isWaiting = false;
      }
    );
  }
}
