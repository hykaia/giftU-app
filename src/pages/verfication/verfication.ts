import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { TimerObservable } from "rxjs/observable/TimerObservable";

@IonicPage()
@Component({
  selector: "page-verfication",
  templateUrl: "verfication.html"
})
export class VerficationPage {
  isWaiting: boolean = false;
  isDisabled: boolean = false;
  time: number = 10;
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

  verify() {
    this.isWaiting = true;
    let params = {
      phone: `${this.loginData.countryCode}${this.loginData.phone}`,
      password: this.loginData.password
    };
    this.api.verify(params).subscribe(
      data => {
        console.log("verify result :", data);
        if (data.success) {
          this.general.presentToast(data.message);
          localStorage.setItem("isLogin", JSON.stringify(true));
          localStorage.setItem("access_token", data.access_token);
          this.event.publish("loginSuccess");
          if(data.exist_user){
            this.navCtrl.setRoot("MyFriendsPage");
          }else{
            this.navCtrl.setRoot("RegisterPage");
          }
        }
        this.isWaiting = false;
      },
      err => {
        this.general.showErrors(err);
        this.isWaiting = false;
      }
    );
  }

  timeCount() {
    this.time = 10;
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
