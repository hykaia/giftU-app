import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { FormBuilder, Validators } from "@angular/forms";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import * as _ from "lodash";

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
  verificationForm: any;
  subscription: any;
  data: any = {};
  loginData: any = this.navParams.get("loginData");
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private event: Events,
    public builder: FormBuilder,
    private zone: NgZone,
    private general: GeneralProvider,
    public navParams: NavParams
  ) {
    this.verificationForm = this.builder.group({
      code: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$")
        ])
      ]
    });
    console.log("userId : ", this.loginData.userId);
  }

  ngOnInit() {
    this.timeCount();
  }

  verify() {
    if (!this.data.mobile_token) {
      this.general.showCustomAlert("Warning", "You must enter verify code");
    } else {
      this.isWaiting = true;
      this.data.user = this.loginData.userId;
      this.data.mobile_token = Number(this.data.mobile_token);
      this.api.verify(this.data).subscribe(
        data => {
          console.log("verify data :", data);
          if (!_.has(data, "name")) {
            this.navCtrl.setRoot("RegisterPage");
          } else {
            // this.navCtrl.setRoot("RegisterPage");
            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("isLogin", JSON.stringify(true));
            this.navCtrl.setRoot("InviteYourFriendsPage"); //test purpose
          }
          this.updateDeviceToken();
          localStorage.setItem("access_token", data.token);
          localStorage.setItem("userId", data._id);
          this.isWaiting = false;
        },
        err => {
          this.isWaiting = false;
          this.general.showError(err.error);
          console.log("verify error :", err.error.message);
        }
      );
    }
  }

  updateDeviceToken() {
    let device_token = localStorage.getItem("device_token");
    let params = {
      one_signal_token: device_token ? device_token : ""
    };
    this.api.register(params).subscribe(
      data => {
        console.log("device token updated");
      },
      err => {
        console.log("register error is :", JSON.stringify(err));
      }
    );
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
    this.api.login(this.loginData).subscribe(
      data => {},
      err => {
        this.general.showError(err.error);
        this.isWaiting = false;
      }
    );
  }
}
