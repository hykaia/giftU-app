import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  isWaiting: boolean = false;
  data: any = {
    gender: "male",
    date_of_birth: "2000-01-01"
  };
  verificationData: any = this.navParams.get("verificationData");
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private general: GeneralProvider,
    public navParams: NavParams
  ) {
    console.log("verificationData is : ", this.verificationData);
  }

  register() {
    // // this.navCtrl.setRoot("InviteYourFriendsPage");
    this.isWaiting = true;
    let params: any;
    params = {
      phone: this.verificationData.phone,
      country_code: this.verificationData.countryCode,
      name: this.data.first_name,
      status: this.data.status,
      gender: this.data.gender,
      date_of_birth: this.data.date_of_birth,
      device_id: "54236643652",
      device_type: "iPhone 6",
      device_token: "a98ucsa8ayv76ta5rc5we6fg78f9he8w7gvr6fe5r6e7g87e"
    };
    console.log("data : ", params);
    this.api.register(params).subscribe(
      data => {
        if (data.code == "201" || data.code == "200") {
          localStorage.setItem("isProfileComplete", JSON.stringify(true));
          localStorage.setItem("userData", JSON.stringify(data.data));
          this.navCtrl.setRoot("InviteYourFriendsPage");
        }
        this.isWaiting = false;
      },
      err => {
        this.general.showErrors(err);
        this.isWaiting = false;
      }
    );
  }
}
