import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview} from '@ionic-native/camera-preview';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  segments: any = "my_wishlist";
  Gifts : any = new Array(3);
  codes : any = {
    birthday : String.fromCodePoint(0x1F60E),
    love : String.fromCodePoint(0x1F618)
  }
  constructor(public navCtrl: NavController, 
    private cameraPreview: CameraPreview,
    public navParams: NavParams) {
  }
  ionViewWillEnter(){
    this.cameraPreview.stopCamera();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

  AddGift(){
    this.navCtrl.push('UploadGiftImgPage')
  }

}
