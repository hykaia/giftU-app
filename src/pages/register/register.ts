import { Component, NgZone } from "@angular/core";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from "@angular/platform-browser";
import { File } from "@ionic-native/file";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  LoadingController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { GeneralProvider } from "../../providers/general/general";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { SettingProvider } from "../../providers/setting/setting";
@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  isWaiting: boolean = false;
  data: any = {
    gender: "male",
    date_of_birth: "1993-08-14"
  };
  base64Img: any = null;
  verificationData: any = this.navParams.get("verificationData");
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private setting: SettingProvider,
    private loadingCtrl: LoadingController,
    private file: File,
    private transfer: FileTransfer,
    private ngzone: NgZone,
    private actionSheetCtrl: ActionSheetController,
    private general: GeneralProvider,
    public domSanitizer: DomSanitizer,
    private camera: Camera,
    public navParams: NavParams
  ) {
    console.log("verificationData is : ", this.verificationData);
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

  register() {
    this.data.phone = `${
      this.verificationData.countryCode
    }${this.verificationData.phone.replace(/^0+/, "")}`;

    if (this.data.name) {
      let nameArray: any[] = this.data.name.split(" ");
      if (nameArray.length > 1) {
        this.data.phone = `${
          this.verificationData.countryCode
        }${this.verificationData.phone.replace(/^0+/, "")}`;
        // this.data.country_code = this.verificationData.countryCode;
        this.data.device_id = "54236643652";
        this.data.device_type = "iPhone 6";
        this.data.device_token = localStorage.getItem("device_token");
        console.log("data is :", this.data);
        this.isWaiting = true;
        /** if image selected */
        if (this.data.imageUri) {
          this.sendDataToServerUsingFileTransfer();
        } else {
          this.sendDataToServerWithoutFileTransfer();
        }
      } else {
        this.setting.presentToast(
          "Name must contain at least first name and last name"
        );
      }
    } else {
      this.setting.presentToast("Add Name First");
    }
  }

  sendDataToServerWithoutFileTransfer() {
    this.api.register(this.data).subscribe(data => {
      if (data.code == "201") {
        localStorage.setItem("isProfileComplete", JSON.stringify(true));
        localStorage.setItem("isLogin", JSON.stringify(true));
        localStorage.setItem("userData", JSON.stringify(data.data));
        this.navCtrl.setRoot("InviteYourFriendsPage");
      }
    });
  }

  sendDataToServerUsingFileTransfer() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "profile_image",
      fileName: `user_img`,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
      params: this.data
    };

    fileTransfer
      .upload(this.data.imageUri, `http://giftu.co/user`, options)
      .then(
        data => {
          console.log("data coming is : ", data);
          let response = JSON.parse(data.response);
          if (response["code"] == "201") {
            localStorage.setItem("isProfileComplete", JSON.stringify(true));
            localStorage.setItem("userData", JSON.stringify(response["data"]));
            console.log(
              "user data response is :",
              JSON.stringify(response["data"])
            );
            this.navCtrl.setRoot("InviteYourFriendsPage");
          }
          this.isWaiting = false;
        },
        err => {
          console.log(err);
          this.isWaiting = false;
        }
      );
  }
}
