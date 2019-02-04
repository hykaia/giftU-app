import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
// import { Keyboard } from "@ionic-native/keyboard";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  isWaiting: boolean = false
  data: any = {
    countryCode: "+966"
  };
  countrCodes: any[] = [{ code: "+2" }, { code: "+966" }];
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    // public keyboard: Keyboard,
    private general: GeneralProvider,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
  
  }

  ionViewDidEnter(){

  }


  Login() {

    this.isWaiting = true
    let params = {
      phone: `${this.data.countryCode}${this.data.phone}`
    }
    this.api.login(params).subscribe(
      data => {
        if (data.success) {
          this.navCtrl.push("VerficationPage", { loginData: this.data });
        }
        this.isWaiting = false
      },
      err => {
        this.general.showErrors(err);
        this.isWaiting = false
      }
    )

  }



}
