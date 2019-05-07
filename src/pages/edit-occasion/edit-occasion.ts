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
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-edit-occasion",
  templateUrl: "edit-occasion.html"
})
export class EditOccasionPage {
  data: any = this.navParams.get("occasion");
  occasionCategories: any;
  loading: any;
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    if (!this.data.is_wish_list) {
      this.data.category = this.data.category._id;
    }

    this.getOccasionCategories();
    console.log("occasion data : ", this.data);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editOccasion() {
    this.presentLoading();
    let params = {
      occasionId: this.data._id,
      slogan: this.data.slogan,
      name: this.data.name,
      date: moment(this.data.date).format("YYYY-MM-DD"),
      category: this.data.category
    };
    console.log("occasion date :", params);

    this.api.editOccasion(params).subscribe(
      data => {
        console.log("response edit occasion : ", data);
        data.operationType = "update";
        data.gifts = this.data.gifts;
        this.loading.dismiss();
        this.viewCtrl.dismiss(data);
      },
      err => {
        this.loading.dismiss();
      }
    );
  }

  delete() {
    this.presentLoading();
    this.api.deleteOccasion(this.data._id).subscribe(
      data => {
        console.log("delete data : ", data);
        this.loading.dismiss();
        data.operationType = "delete";
        this.viewCtrl.dismiss(data);
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

  getOccasionCategories() {
    this.api.getOccasionCategories().subscribe(
      data => {
        this.occasionCategories = data;
      },
      err => {
        console.log("get occasion categories err :", err);
      }
    );
  }
}
