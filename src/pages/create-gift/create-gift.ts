import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview } from '@ionic-native/camera-preview';

@IonicPage()
@Component({
  selector: 'page-create-gift',
  templateUrl: 'create-gift.html',
})
export class CreateGiftPage {
  data: any = {
    gift_name: "iPhone xs max",
    post: "i want iPhone xs max - Black",
    img: this.navParams.get('img')
  }
  constructor(public navCtrl: NavController,
    private cameraPreview: CameraPreview,
    public navParams: NavParams) {
    console.log("gift image : ", this.data.img);
  }

  ionViewWillEnter() {
    this.cameraPreview.stopCamera();
  }


  share() {
    console.log('====================================');
    console.log("gift data are : ", this.data);
    console.log('====================================');
    // this.navCtrl.popTo('MyProfilePage')
    this.navCtrl.push("MyProfilePage").then(() =>  {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
  });
  }

}
