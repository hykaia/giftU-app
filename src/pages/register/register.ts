import { Component, NgZone } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
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
  ActionSheetController
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
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
    birth_date: "1993-08-14"
  };
  registrationForm: any;
  base64Img: any = null;
  msgTranslation;
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    public builder: FormBuilder,
    private translate: TranslateService,
    private file: File,
    private transfer: FileTransfer,
    private ngzone: NgZone,
    private actionSheetCtrl: ActionSheetController,
    private general: GeneralProvider,
    private camera: Camera,
    public navParams: NavParams
  ) {
    this.registrationForm = this.builder.group({
      name: ["", Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.translate
      .get(["camera", "choose_gallery", "gallery", "cancel"])
      .subscribe(data => {
        this.msgTranslation = data;
      });
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
    this.isWaiting = true;
    let device_token = localStorage.getItem("device_token");
    this.data.name = this.registrationForm.value.name;
    this.data.one_signal_token = device_token ? device_token : "";
    this.isWaiting = true;
    /** if image selected */
    if (this.data.imageUri) {
      this.sendDataToServerUsingFileTransfer();
    } else {
      this.sendDataToServerWithoutFileTransfer();
    }
  }

  sendDataToServerWithoutFileTransfer() {
    this.api.register(this.data).subscribe(
      data => {
        this.isWaiting = false;
        localStorage.setItem("userData", data);
        this.navCtrl.setRoot("InviteYourFriendsPage");
      },
      err => {
        this.isWaiting = false;
        this.general.showError(err.error);
        console.log("register error is :", err);
      }
    );
  }

  sendDataToServerUsingFileTransfer() {
    let userId = localStorage.getItem("userId");
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
        `https://api-giftu.hakaya.technology/users/${userId}`,
        options
      )
      .then(
        data => {
          localStorage.setItem("userData", data.response);
          this.navCtrl.setRoot("InviteYourFriendsPage");
          this.isWaiting = false;
        },
        err => {
          console.log(err);
          this.isWaiting = false;
        }
      );
  }
}
