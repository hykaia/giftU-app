import { Component, NgZone } from "@angular/core";
import { File } from "@ionic-native/file";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  LoadingController
} from "ionic-angular";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from "@angular/platform-browser";
import { Base64 } from "@ionic-native/base64";
import { Device } from "@ionic-native/device";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";

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
  imageURI: any;
  imgBase64: any;
  base64Img: any = null;
  imageFileName: any;
  isWaiting: boolean = false;
  gift: any = this.navParams.get("gift"); // for update gift
  occasionId: any = this.navParams.get("occasionId");
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private cameraPreview: CameraPreview,
    private loadingCtrl: LoadingController,
    private device: Device,
    private file: File,
    private ngzone: NgZone,
    public domSanitizer: DomSanitizer,
    private base64ToGallery: Base64ToGallery,
    private platform: Platform,
    public navParams: NavParams
  ) {
    console.log("receiving gift is :", this.gift);
    this.startCamera();
  }

  // ionViewWillEnter() {

  // }
  ionViewDidEnter() {
    if (this.platform.is("cordova")) {
      console.log("Device details is: " + JSON.stringify(this.device.model));
    }
  }

  startCamera() {
    let options: CameraPreviewOptions = {
      x: 0,
      y: 100,
      width: window.screen.width,
      height: 350,
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
        this.base64Img = "data:image/jpeg;base64," + imageData;
        this.convertBase64ToFile(this.base64Img);
      },
      err => {
        console.log(err);
      }
    );
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 80,
      saveToPhotoAlbum: false,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 400,
      targetHeight: 400
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Img = imageData;
        this.convertFileToImg(imageData);
      },
      err => {
        console.log("image err : ", err);
      }
    );
  }

  Next() {
    let giftImageData: any = {
      occasionId: this.occasionId,
      imageURI: this.imageURI
    };
    console.log("uploaded image data : ", JSON.stringify(giftImageData));

    this.navCtrl.push("CreateGiftPage", {
      giftImageData: giftImageData,
      gift: this.gift // for update gift
    });
  }

  convertFileToImg(imageData) {
    this.file
      .resolveLocalFilesystemUrl(imageData)
      .then((entry: any) => {
        entry.file(file1 => {
          var reader = new FileReader();
          reader.onload = (encodedFile: any) => {
            var src = encodedFile.target.result;
            console.log("hi mo");
            this.ngzone.run(() => {
              this.base64Img = src;
            });
          };
          reader.readAsDataURL(file1);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  convertBase64ToFile(base64) {
    this.base64ToGallery
      .base64ToGallery(base64, { prefix: "_img", mediaScanner: false })
      .then(
        res => {
          console.log("Saved image to gallery ", res);
          this.imageURI = `file://${res}`;
        },
        err =>
          console.log("Error saving image to gallery ", JSON.stringify(err))
      );
  }
}
