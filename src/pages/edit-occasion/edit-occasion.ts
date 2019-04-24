import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  LoadingController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-edit-occasion",
  templateUrl: "edit-occasion.html"
})
export class EditOccasionPage {
  data: any = this.navParams.get("occasion");
  loading: any;
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    console.log("occasion data : ", this.data);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editOccasion() {
    this.presentLoading();
    this.api.editOccasion(this.data).subscribe(data => {
      console.log("response edit occasion : ", data);
      if (data.code == "201") {
        data.data.operationType = "update";
        data.data.gifts = this.data.gifts;
        this.loading.dismiss();
        this.viewCtrl.dismiss(data.data);
      }
    }),
      err => {
        this.loading.dismiss();
      };
  }

  delete() {
    this.presentLoading();
    this.api.deleteOccasion(this.data.id).subscribe(
      data => {
        console.log("delete data : ", data);
        if (data.code == "201") {
          this.loading.dismiss();
          data.data.operationType = "delete";
          this.viewCtrl.dismiss(data.data);
        }
      },
      err => {
        this.loading.dismiss();
      }
    );
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

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loading.present();
  }
}
