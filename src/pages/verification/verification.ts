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
  data: any = {};
  comingData: any = this.navParams.get("loginData");
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private event: Events,
    private zone: NgZone,
    private general: GeneralProvider,
    public navParams: NavParams
  ) {
    // console.log("comingData : ", this.comingData);
  }

  ngOnInit() {
    this.timeCount();
  }

  verify() {
    this.data.password = this.general.convertNumber(this.data.password);
    if (!this.data.password) {
      this.general.showCustomAlert("Warning", "You must enter verify code");
    } else {
      /** user is the first time to use the app. */
      if (this.comingData.loginData.data.isFirstTime) {
        if (this.comingData.loginData.data.valid_phone == this.data.password) {
          let verificationData = {
            phone: this.comingData.phone,
            countryCode: this.comingData.countryCode
          };
          this.navCtrl.setRoot("RegisterPage", {
            verificationData: verificationData
          });
        }
      } else {
        if (this.comingData.loginData.data.valid_phone == this.data.password) {
          this.isWaiting = true;
          this.api.verify(this.comingData).subscribe(
            data => {
              console.log("response verify  data is :", data);
              if (data.code == "201") {
                localStorage.setItem("isLogin", JSON.stringify(true));
                localStorage.setItem(
                  "userData",
                  JSON.stringify(this.comingData.loginData.data)
                );
                // this.navCtrl.setRoot("MyFriendsPage");
                this.navCtrl.setRoot("InviteYourFriendsPage"); //test purpose
              }
              this.isWaiting = false;
            },
            err => {
              console.log("verify error :", err);
              this.isWaiting = false;
            }
          );
        }
      }
    }
  }

  timeCount() {
    this.time = 4;
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
      countryCode: this.comingData.countryCode,
      phone: this.comingData.phone
    };
    this.api.login(params).subscribe(
      data => {
        this.comingData = {
          loginData: {
            data: data.data
          },
          phone: this.comingData.phone,
          countryCode: this.comingData.countryCode
        };
      },
      err => {
        this.general.showErrors(err);
        this.isWaiting = false;
      }
    );
  }
}
