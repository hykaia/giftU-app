import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";
import { AlertController, ToastController } from "ionic-angular";
import * as moment from "moment";
@Injectable()
export class SettingProvider {
  URL: string = "https://api-giftu.hakaya.technology/";
  msgTranslation: any;
  constructor(
    public http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {}

  ionViewDidLoad() {
    this.translate.get(["ok"]).subscribe(data => {
      this.msgTranslation = data;
    });
  }

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
        buttons: [this.msgTranslation.ok]
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
}
