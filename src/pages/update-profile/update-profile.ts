import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-update-profile",
  templateUrl: "update-profile.html"
})
export class UpdateProfilePage {
  data: any = JSON.parse(localStorage.getItem("userData"));
  userData: any = JSON.parse(localStorage.getItem("userData"));
  isWaiting: boolean = false;
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private viewCtrl: ViewController,
    public navParams: NavParams
  ) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateProfile() {
    console.log("before update : ", this.data);
    this.isWaiting = true;
    this.api.updateProfile(this.data).subscribe(
      data => {
        if (data.code == "201") {
          localStorage.setItem("userData", JSON.stringify(data.data));
          this.dismiss();
        }
        this.isWaiting = false;
      },
      err => {
        this.isWaiting = false;
        console.log("update profile error : ", err);
      }
    );
  }
}
