import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AlertController, ToastController } from "ionic-angular";
import * as moment from "moment";
@Injectable()
export class SettingProvider {
  URL: string = "http://giftu.co/";
  constructor(
    public http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  showError(errors) {
    let text = "";
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        console.log(key + " -> " + errors[key]);
        text += errors[key] + "<br><br>";
      }
    }
    this.showAlert(text);
  }

  async showAlert(text) {
    this.alertCtrl
      .create({
        subTitle: text,
        buttons: ["موافق"]
      })
      .present();
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  formatDate(date) {
    return moment.unix(date).format("YYYY/MM/DD");
  }

  getDateDifferenceInDays(date) {
    var start = moment(date, "YYYY-MM-DD");
    var end = moment(new Date()).format("YYYY-MM-DD");
    let final = moment.duration(start.diff(end)).asDays();
    return final;
  }

  imgBasedOnOccasionType(type) {
    switch (type) {
      case "wedding":
        return "assets/imgs/wedding.png";
      case "birthday":
        return "assets/imgs/birthday.png";
      case "job":
        return "assets/imgs/promotion.png";
      case "new_baby":
        return "assets/imgs/wedding.png";
      case "graduation":
        return "assets/imgs/wedding.png";
    }
  }
}
