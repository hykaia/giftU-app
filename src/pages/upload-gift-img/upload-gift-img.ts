import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {
  CameraPreview,
  CameraPreviewPictureOptions,
  CameraPreviewOptions,
  CameraPreviewDimensions
} from "@ionic-native/camera-preview";
@IonicPage()
@Component({
  selector: "page-upload-gift-img",
  templateUrl: "upload-gift-img.html"
})
export class UploadGiftImgPage {
  img: any;
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private cameraPreview: CameraPreview,
    private platform: Platform,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    // Code here
  }

  ionViewWillEnter() {
    this.startCamera();
    console.log("iam back");
  }

  startCamera() {
    let options: CameraPreviewOptions = {
      x: 0,
      y: 62,
      width: window.screen.width,
      height: 500,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      toBack: false
    };

    // start camera
    this.cameraPreview.startCamera(options).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  takePicture() {
    let cameraOptions: CameraPreviewPictureOptions = {
      width: 500,
      height: 500,
      quality: 85
    };
    this.cameraPreview.takePicture(cameraOptions).then(
      imageData => {
        this.img = "data:image/jpeg;base64," + imageData;
      },
      err => {
        console.log(err);
      }
    );
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.img = "data:image/jpeg;base64," + imageData;
      },
      err => {
        console.log("image err : ", err);
      }
    );
  }

  Next() {
    this.navCtrl.push("CreateGiftPage", { img: this.img });
  }
}
