import { Component, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController,
  LoadingController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";

@IonicPage()
@Component({
  selector: "page-suggest-gift",
  templateUrl: "suggest-gift.html"
})
export class SuggestGiftPage {
  giftData: any = this.navParams.get("giftData");
  base64Img: any = null;
  loader: any;
  data: any = {
    title: "iPhone Xs Max",
    description: "What do you think about this, my friend ?",
    is_anonymous: 0
  };
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private api: ApiProvider,
    private file: File,
    private transfer: FileTransfer,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private setting: SettingProvider,
    public navParams: NavParams
  ) {
    this.fillGiftInfo();
    console.log("giftData : ", this.giftData);
  }

  fillGiftInfo() {
    this.data.occasion_id = this.giftData.occasion_id;
    this.data.userWhoReceiveGift = this.giftData.userId;
    this.data.suggesting_user_id = JSON.parse(
      localStorage.getItem("userData")
    ).id;
  }

  suggestGift() {
    this.data.is_anonymous = this.data.is_anonymous ? 1 : 0;
    if (this.data.imageUri) {
      this.sendToServerWithFileTransfer();
    } else {
      this.sendDataToServerWithoutFileTransfer();
    }
  }

  sendDataToServerWithoutFileTransfer() {
    console.log("suggestion data  :", this.data);
    this.api.suggestGift(this.data).subscribe(data => {
      if (data.code == "201") {
        this.setting.presentToast("You have suggested gift successfully !");
        this.viewCtrl.dismiss(data.data);
      }
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Choose gallery",
      buttons: [
        {
          text: "Camera",
          role: "Camera",
          handler: () => {
            this.uploadImage(0);
          }
        },
        {
          text: "Gallery",
          handler: () => {
            this.uploadImage(1);
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }

  uploadImage(type) {
    const options: CameraOptions = {
      quality: 80,
      saveToPhotoAlbum: false,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:
        type == 0
          ? this.camera.PictureSourceType.CAMERA
          : this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 400,
      targetHeight: 400
    };

    this.camera.getPicture(options).then(
      imageData => {
        console.log("imageData : ", imageData);
        this.data.imageUri = imageData;
        this.convertFileToImg(imageData);
      },
      err => {
        // Handle error
      }
    );
  }

  sendToServerWithFileTransfer() {
    this.presentLoading();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: `gift_img`,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
      params: this.data
    };

    fileTransfer
      .upload(
        this.data.imageUri,
        `http://giftu.co/gift/${this.data.userWhoReceiveGift}`,
        options
      )
      .then(
        data => {
          let response = JSON.parse(data.response);
          if (response["code"] == "201") {
            console.log("upload suggest gift :", JSON.stringify(response));
            this.setting.presentToast("You have suggested gift successfully !");
            this.viewCtrl.dismiss(response["data"]);
          } else {
            this.setting.presentToast("an error occur");
          }
          this.loader.dismiss();
        },
        err => {
          console.log(err);
          this.loader.dismiss();
        }
      );
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.loader.present();
  }

  convertFileToImg(imageData) {
    this.file
      .resolveLocalFilesystemUrl(imageData)
      .then((entry: any) => {
        entry.file(file1 => {
          var reader = new FileReader();
          reader.onload = (encodedFile: any) => {
            var src = encodedFile.target.result;
            this.ngZone.run(() => {
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
}
