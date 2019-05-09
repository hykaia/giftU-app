import { Component, NgZone } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController
} from "ionic-angular";
import { File } from "@ionic-native/file";
import { TranslateService } from "@ngx-translate/core";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-update-profile",
  templateUrl: "update-profile.html"
})
export class UpdateProfilePage {
  data: any = JSON.parse(localStorage.getItem("userData"));
  userData: any = JSON.parse(localStorage.getItem("userData"));
  isWaiting: boolean = false;
  msgTranslation;
  base64Img: any = null;
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private api: ApiProvider,
    private ngzone: NgZone,
    private translate: TranslateService,
    private file: File,
    private transfer: FileTransfer,
    private actionSheetCtrl: ActionSheetController,
    private viewCtrl: ViewController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    this.translate
      .get(["camera", "choose_gallery", "gallery", "cancel"])
      .subscribe(data => {
        this.msgTranslation = data;
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateProfile() {
    this.isWaiting = true;
    if (this.data.imageUri) {
      this.sendDataToServerUsingFileTransfer();
    } else {
      this.sendDataToServerUsingWithoutFileTransfer();
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.msgTranslation.choose_gallery,
      buttons: [
        {
          text: this.msgTranslation.camera,
          role: "Camera",
          handler: () => {
            this.uploadImage(0);
          }
        },
        {
          text: this.msgTranslation.gallery,
          handler: () => {
            this.uploadImage(1);
          }
        },
        {
          text: this.msgTranslation.cancel,
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

  sendDataToServerUsingWithoutFileTransfer() {
    this.api.updateProfile(this.data).subscribe(
      data => {
        localStorage.setItem("userData", JSON.stringify(data));
        this.dismiss();
        this.isWaiting = false;
      },
      err => {
        this.isWaiting = false;
        console.log("update profile error : ", err);
      }
    );
  }

  sendDataToServerUsingFileTransfer() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "profile_image",
      fileName: `user_img.jpeg`,
      chunkedMode: false,
      httpMethod: "PUT",
      mimeType: "image/jpeg",
      headers: {
        Authorization: `${localStorage.getItem("access_token")}`
      },
      params: { data: JSON.stringify(this.data) }
    };

    fileTransfer
      .upload(
        this.data.imageUri,
        `https://api-giftu.hakaya.technology/users/${this.userData._id}`,
        options
      )
      .then(
        data => {
          console.log(
            "update profile data response are : ",
            JSON.parse(data.response)
          );
          localStorage.setItem("userData", data.response);
          this.dismiss();
          this.isWaiting = false;
        },
        err => {
          console.log(err);
          this.isWaiting = false;
        }
      );
  }
}
