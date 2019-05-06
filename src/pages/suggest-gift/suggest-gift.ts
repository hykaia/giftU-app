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
import { FormBuilder, Validators } from "@angular/forms";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { GeneralProvider } from "../../providers/general/general";

@IonicPage()
@Component({
  selector: "page-suggest-gift",
  templateUrl: "suggest-gift.html"
})
export class SuggestGiftPage {
  giftData: any = this.navParams.get("giftData");
  userId = localStorage.getItem("userId");
  base64Img: any = null;
  suggestGiftForm: any;
  loader: any;
  data: any = {
    anonymous: false
  };
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private api: ApiProvider,
    public builder: FormBuilder,
    private general: GeneralProvider,
    private file: File,
    private transfer: FileTransfer,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private setting: SettingProvider,
    public navParams: NavParams
  ) {
    this.suggestGiftForm = this.builder.group({
      name: ["", Validators.compose([Validators.required])],
      post: ["", Validators.compose([Validators.required])]
    });
    console.log("giftData : ", this.giftData);
  }
  suggestGift() {
    this.data.anonymous = this.data.anonymous;
    this.data.occasion = this.giftData.occasion;
    this.sendToServerWithFileTransfer();
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
    console.log("final data : ", this.data);

    this.presentLoading();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: `gift_img.jpeg`,
      httpMethod: "POST",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        Authorization: `${localStorage.getItem("access_token")}`
      },
      params: { data: JSON.stringify(this.data) }
    };

    fileTransfer
      .upload(
        this.data.imageUri,
        `https://api-giftu.hakaya.technology/users/${this.userId}/occasions/${
          this.data.occasion
        }/gifts/suggest`,
        options
      )
      .then(
        data => {
          let response = JSON.parse(data.response);
          console.log("upload suggest gift :", JSON.stringify(response));
          this.setting.presentToast("You have suggested gift successfully !");
          this.viewCtrl.dismiss(response["data"]);
          this.loader.dismiss();
        },
        err => {
          console.log("tozzz :", err);
          console.log(JSON.stringify(err));
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
