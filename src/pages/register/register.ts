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
  isWaiting: boolean = false
  data: any = {
    Gender: 'male',
    birth: '2019-01-20'
  }
  constructor(public navCtrl: NavController,
    private api: ApiProvider,
    private general: GeneralProvider,
    public navParams: NavParams) { }


  register() {
    this.isWaiting = true
    this.api.register(this.data).subscribe(data => {
      console.log("my data : ", data);
      if (data.data.success) {
        localStorage.setItem('isProfileComplete', JSON.stringify(true))
        this.navCtrl.setRoot('InviteYourFriendsPage')
      }
      this.isWaiting = false
    }, err => {
      this.general.showErrors(err)
      this.isWaiting = false
    })
  }
}
