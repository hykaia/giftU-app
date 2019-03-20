import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-edit-occasion",
  templateUrl: "edit-occasion.html"
})
export class EditOccasionPage {
  data: any = this.navParams.get("occasion");
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    console.log("occasion data : ", this.data);
  }

  ionViewDidLoad() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editOccasion() {
    this.api.editOccasion(this.data).subscribe(data => {
      console.log("response edit occasion : ", data);
      if (data.code == "200" || data.code == "201") {
        data.data.operationType = "update";
        this.viewCtrl.dismiss(data.data);
      }
    });
  }

  delete() {
    this.api.deleteOccasion(this.data.id).subscribe(data => {
      console.log("delete data : ", data);
      if (data.code == "201") {
        data.data.operationType = "delete";
        this.viewCtrl.dismiss(data.data);
      }
    });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Confirm Delete",
      message: "Do you want to delete this occasion?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Delete",
          handler: () => {
            this.delete();
          }
        }
      ]
    });
    alert.present();
  }
}
