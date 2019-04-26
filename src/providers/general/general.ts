import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "ionic-angular";
import * as moment from "moment";
import { ApiProvider } from "../api/api";
import * as _ from "lodash";
@Injectable()
export class GeneralProvider {
  lang: any = localStorage.getItem("lang");
  constructor(
    public http: HttpClient,
    private toastCtrl: ToastController,
    private api: ApiProvider,
    private alertCtrl: AlertController
  ) {}

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  showError(error) {
    if (_.has(error, "details")) {
      let text = "";
      let errs = error.details;
      for (let i = 0; i < errs.length; i++) {
        text += errs[i].message + "<br><br>";
      }
      console.log("a77a txt :", text);
      this.showAlert(text);
    } else {
      this.presentToast(error.message);
    }
  }

  showAlert(text) {
    this.alertCtrl
      .create({
        title: "Warning",
        subTitle: text,
        buttons: ["Ok"]
      })
      .present();
  }

  showCustomAlert(title, text) {
    this.alertCtrl
      .create({
        title: title,
        subTitle: text,
        buttons: ["Ok"]
      })
      .present();
  }

  formatDate(date) {
    return moment(date).format("YYYY/MM/DD h:mm  a");
  }

  convertNumber(val) {
    let persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g
    ];
    let arabicNumbers = [
      /٠/g,
      /١/g,
      /٢/g,
      /٣/g,
      /٤/g,
      /٥/g,
      /٦/g,
      /٧/g,
      /٨/g,
      /٩/g
    ];

    if (typeof val === "string") {
      for (let i = 0; i < 10; i++) {
        val = val.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }

    return val;
  }
}
