import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
@Injectable()
export class SettingProvider {
  URL: string = 'http://giftu.burgerinzzr.com/api/'
  constructor(public http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {

  }


  showError(errors) {
    let text = ""
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        console.log(key + " -> " + errors[key])
        text += errors[key] + "<br><br>"
      }
    }
    this.showAlert(text)
  }

  async showAlert(text) {
    this.alertCtrl.create({
      subTitle: text,
      buttons: ['موافق']
    }).present();
  }


  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  formatDate(date) {
    return moment.unix(date).format("YYYY/MM/DD");
  }

}
