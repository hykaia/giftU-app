import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview } from '@ionic-native/camera-preview';
import { Emotions, Gifts, Occasions } from './mocks';
@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  segments: any = "my_wishlist";
  WishList: any = new Array(3)
  Gifts: any = Gifts
  data: any = {
    name: "My Birthday",
    slogan: "Say happy birthday",
    birth: '2019-01-20',
    type: "Public"
  }
  Occasions: any = Occasions
  Emotions: any[] = Emotions
  codes: any = {
    birthday: String.fromCodePoint(0x1F60E),
    love: String.fromCodePoint(0x1F618)
  }
  constructor(public navCtrl: NavController,
    private cameraPreview: CameraPreview,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.cameraPreview.stopCamera();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

  AddGift() {
    this.navCtrl.push('UploadGiftImgPage')
  }

}
